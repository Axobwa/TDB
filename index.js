const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

// 🔧 Remplace ces deux valeurs
const TOKEN = process.env.TOKEN;
const TARGET_CHANNEL_ID = process.env.CHANNEL_ID;

function rejoindreVocal() {
  const channel = client.channels.cache.get(TARGET_CHANNEL_ID);
  if (!channel) return console.log('Salon introuvable !');

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: true,
  });

  console.log(`✅ Connecté dans : ${channel.name}`);
}

client.once('ready', () => {
  console.log(`🤖 Bot connecté : ${client.user.tag}`);
  rejoindreVocal();
});

// Si le bot est déplacé ou déconnecté → il revient immédiatement
client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.member.id !== client.user.id) return;

  if (!newState.channelId || newState.channelId !== TARGET_CHANNEL_ID) {
    console.log('⚠️ Bot déplacé/déconnecté, retour au salon...');
    setTimeout(rejoindreVocal, 1000); // petit délai pour éviter les conflits
  }
});

client.login(TOKEN);
