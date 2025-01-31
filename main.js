const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ] 
});

const TOKEN = 'VOTRE_TOKEN'; // Définissez ici le token de votre bot
const TIMEOUT_DURATION = 600000; // Choissisez la durée du timeout (ici c'est 10 minutes en milisecondes)


const rouletteCommand = new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Joue à la roulette russe - 1 chance sur 6 de se faire timeout!');


const lastResults = new Map();

function getRandomNumber(userId) {
    const lastResult = lastResults.get(userId);
    let newResult;
  

    do {
        newResult = Math.floor(Math.random() * 6) + 1;
    } while (lastResult === newResult);
  

    lastResults.set(userId, newResult);
    return newResult;
}


const survieMessages = [
    "a survécu de justesse!",
    "peut respirer tranquillement...",
    "a eu chaud!",
    "s'en sort bien!",
    "vit pour jouer un autre jour!",
    "a de la chance aujourd'hui!"
];

function getRandomSurvieMessage() {
    return survieMessages[Math.floor(Math.random() * survieMessages.length)];
}

client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    try {
        await client.application.commands.set([rouletteCommand]);
        console.log('Commande slash enregistrée');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la commande:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || interaction.commandName !== 'roulette') return;

    const member = interaction.member;
    const isInVoice = member.voice.channel !== null;
  

    const result = getRandomNumber(member.id);
  
    if (result === 1) {
        try {
            if (member.moderatable) {
                await member.timeout(TIMEOUT_DURATION, 'Roulette russe - Perdu!');
                await interaction.reply({
                    content: `🔫 **BAM!** ${member.toString()} a perdu à la roulette russe! Timeout de 10 minutes. (${result}/6)`,
                    ephemeral: false
                });
            } else {
                await interaction.reply({
                    content: `🔫 **BAM!** ${member.toString()} a perdu à la roulette russe! Impossible de timeout (permissions), merci de quitter le vocal${isInVoice ? ' immédiatement' : ''}. (${result}/6)`,
                    ephemeral: false
                });
            }
        } catch (error) {
            console.error('Erreur lors du timeout:', error);
            await interaction.reply({
                content: 'Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    } else {
        const survieMessage = getRandomSurvieMessage();
        await interaction.reply({
            content: `🔫 *Click!* ${member.toString()} ${survieMessage} (${result}/6)`,
            ephemeral: false
        });
    }
});

client.login(TOKEN);