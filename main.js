//////////////////////////////////////////////////////////////////////////
//                                                                      //
//                        Bot Roulette Russe                            //
//                            by ryzenixx                               //
//                    https://github.com/ryzenixx                       //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


// Importation des modules nécessaires de discord.js
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

// Création du client Discord (le bot) avec les permissions nécessaires
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,            // Permet d'interagir avec les serveurs
    GatewayIntentBits.GuildMembers,      // Permet de gérer les membres
    GatewayIntentBits.GuildVoiceStates   // Permet de détecter si quelqu'un est en vocal
  ] 
});

// Token d'authentification du bot (à garder secret!)
const TOKEN = 'VOTRE_TOKEN';

// Durée par défaut du timeout (10 minutes en millisecondes)
let TIMEOUT_DURATION = 600000;

// Définition de la commande /roulette
const rouletteCommand = new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Joue à la roulette russe - 1 chance sur 6 de se faire timeout!');

// Définition de la commande /settime pour modifier la durée du timeout
const setTimeCommand = new SlashCommandBuilder()
    .setName('settime')
    .setDescription('Définit la durée du timeout pour la roulette russe')
    .addStringOption(option =>
        option.setName('durée')
            .setDescription('Durée du timeout (format: 1h, 30m, 1h30m)')
            .setRequired(true));

// Définition de la commande /gettime pour voir la durée actuelle du timeout
const getTimeCommand = new SlashCommandBuilder()
    .setName('gettime')
    .setDescription('Affiche la durée actuelle du timeout pour la roulette russe');

// Map pour stocker les derniers résultats de chaque utilisateur
const lastResults = new Map();

// Fonction pour convertir une durée en texte (ex: "1h30m") en millisecondes
function parseDuration(duration) {
    const regex = /^(\d+h)?(\d+m)?$/;
    const match = duration.toLowerCase().match(regex);
    
    if (!match) {
        throw new Error('Format invalide. Utilisez le format: 1h, 30m, ou 1h30m');
    }

    let totalMs = 0;
    
    // Conversion des heures en millisecondes
    if (match[1]) {
        const hours = parseInt(match[1]);
        if (hours > 24) throw new Error('La durée maximale est de 24 heures');
        totalMs += hours * 60 * 60 * 1000;
    }
    
    // Conversion des minutes en millisecondes
    if (match[2]) {
        const minutes = parseInt(match[2]);
        if (minutes >= 60) throw new Error('Le nombre de minutes doit être inférieur à 60');
        totalMs += minutes * 60 * 1000;
    }
    
    // Vérifications de sécurité
    if (totalMs === 0) throw new Error('La durée doit être supérieure à 0');
    if (totalMs > 24 * 60 * 60 * 1000) throw new Error('La durée maximale est de 24 heures');
    
    return totalMs;
}

// Fonction pour obtenir un nombre aléatoire entre 1 et 6
// Évite d'avoir deux fois le même résultat pour un même utilisateur
function getRandomNumber(userId) {
    const lastResult = lastResults.get(userId);
    let newResult;
    
    do {
        newResult = Math.floor(Math.random() * 6) + 1;
    } while (lastResult === newResult);
    
    lastResults.set(userId, newResult);
    return newResult;
}

// Messages aléatoires affichés quand un joueur survit
const survieMessages = [
    "a survécu de justesse!",
    "peut respirer tranquillement...",
    "a eu chaud!",
    "s'en sort bien!",
    "vit pour jouer un autre jour!",
    "a de la chance aujourd'hui!"
];

// Fonction pour obtenir un message de survie aléatoire
function getRandomSurvieMessage() {
    return survieMessages[Math.floor(Math.random() * survieMessages.length)];
}

// Fonction pour formater une durée en millisecondes en texte lisible
function formatDuration(ms) {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    
    let formatted = '';
    if (hours > 0) formatted += `${hours}h`;
    if (minutes > 0) formatted += `${minutes}m`;
    return formatted || '0m';
}

// Événement déclenché quand le bot démarre
client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    try {
        // Enregistrement des commandes slash sur Discord
        await client.application.commands.set([rouletteCommand, setTimeCommand, getTimeCommand]);
        console.log('Commandes slash enregistrées');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
    }
});

// Gestion des commandes quand elles sont utilisées
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    switch (interaction.commandName) {
        // Commande /gettime : affiche la durée actuelle du timeout
        case 'gettime':
            await interaction.reply({
                content: `⏱️ La durée actuelle du timeout est de ${formatDuration(TIMEOUT_DURATION)}.`,
                ephemeral: true  // Seul l'utilisateur voit la réponse
            });
            break;

        // Commande /settime : modifie la durée du timeout
        case 'settime':
            // Vérifie si l'utilisateur a les permissions nécessaires
            if (!interaction.member.permissions.has('ModerateMembers')) {
                await interaction.reply({
                    content: '❌ Tu n\'as pas la permission de modifier la durée du timeout.',
                    ephemeral: true
                });
                return;
            }

            const durationStr = interaction.options.getString('durée');
            
            try {
                const newDuration = parseDuration(durationStr);
                TIMEOUT_DURATION = newDuration;
                await interaction.reply({
                    content: `✅ La durée du timeout a été définie sur ${formatDuration(newDuration)}.`,
                    ephemeral: true
                });
            } catch (error) {
                await interaction.reply({
                    content: `❌ Erreur: ${error.message}`,
                    ephemeral: true
                });
            }
            break;

        // Commande /roulette : joue à la roulette russe
        case 'roulette':
            const member = interaction.member;
            const isInVoice = member.voice.channel !== null;  // Vérifie si l'utilisateur est en vocal
            const result = getRandomNumber(member.id);
            
            // Si le résultat est 1, l'utilisateur perd
            if (result === 1) {
                try {
                    if (member.moderatable) {
                        // Application du timeout si possible
                        await member.timeout(TIMEOUT_DURATION, 'Roulette russe - Perdu!');
                        await interaction.reply({
                            content: `🔫 **BAM!** ${member.toString()} a perdu à la roulette russe! Timeout de ${formatDuration(TIMEOUT_DURATION)}. (${result}/6)`,
                            ephemeral: false  // Tout le monde voit la réponse
                        });
                    } else {
                        // Message si impossible d'appliquer le timeout
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
                // Si le résultat n'est pas 1, l'utilisateur survit
                const survieMessage = getRandomSurvieMessage();
                await interaction.reply({
                    content: `🔫 *Click!* ${member.toString()} ${survieMessage} (${result}/6)`,
                    ephemeral: false
                });
            }
            break;
    }
});

// Connexion du bot à Discord
client.login(TOKEN);
