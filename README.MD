# 🎲 Bot Roulette Russe Discord

> Un bot Discord qui apporte un frisson d'adrénaline à votre serveur avec un jeu de roulette russe ! Une chance sur six de recevoir un timeout... Oseras-tu tenter ta chance ? 🎯

## ✨ Caractéristiques

- 🎮 **Simple d'utilisation** - Commandes slash intuitives
- 🎲 **Équitable** - Système anti-répétition pour éviter les résultats identiques consécutifs
- ⚡ **Performant** - Réponses instantanées
- 🛠️ **Configurable** - Durée de timeout personnalisable par les modérateurs
- 🎯 **Amusant** - Messages variés pour plus de dynamisme
- 🔒 **Sécurisé** - Système de permissions intégré

## 📋 Commandes

| Commande | Description | Permission |
|----------|-------------|------------|
| `/roulette` | Lance une partie de roulette russe | Tous |
| `/gettime` | Affiche la durée actuelle du timeout | Tous |
| `/settime` | Modifie la durée du timeout (format: 1h30m) | Modérateur |

## 🤖 Création du Bot Discord

1. **Créer une application Discord**
   - Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
   - Cliquez sur "New Application" et donnez un nom à votre application

2. **Configurer le bot**
   - Dans le menu de gauche, cliquez sur "Bot"
   - Cliquez sur "Add Bot"
   - Activez les trois "Privileged Gateway Intents" :
     - PRESENCE INTENT
     - SERVER MEMBERS INTENT
     - MESSAGE CONTENT INTENT

3. **Récupérer le token**
   - Dans l'onglet "Bot", cliquez sur "Reset Token"
   - Copiez le token (vous en aurez besoin pour la configuration)
   - ⚠️ Ne partagez JAMAIS ce token !

4. **Inviter le bot**
   - Dans le menu de gauche, cliquez sur "OAuth2" puis "URL Generator"
   - Dans "Scopes", sélectionnez :
     - `bot`
     - `applications.commands`
   - Dans "Bot Permissions", sélectionnez :
     - `Moderate Members` (Pour les timeouts)
     - `Send Messages`
     - `Use Slash Commands`
     - `View Channels`
   - Copiez l'URL générée et ouvrez-la dans votre navigateur
   - Sélectionnez votre serveur et cliquez sur "Autoriser"

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/ryzenixx/roulette-russe.git
cd roulette-bot
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer le bot**
- Ouvrez le fichier `main.js`
- Remplacez la valeur de la variable `TOKEN` ligne 23 par votre token Discord :
```javascript
const TOKEN = 'VOTRE_TOKEN';
```

4. **Lancer le bot**
```bash
node main.js
```

## 🔧 Configuration

### Permissions requises pour le bot

- `TIMEOUT_MEMBERS` - Pour appliquer les timeouts
- `SEND_MESSAGES` - Pour envoyer les messages
- `USE_SLASH_COMMANDS` - Pour créer et utiliser les commandes slash

### Format des durées

Le bot accepte les formats suivants pour la commande `/settime` :
- `1h` - 1 heure
- `30m` - 30 minutes
- `1h30m` - 1 heure et 30 minutes

**Limites :**
- Durée minimale : 1 minute
- Durée maximale : 24 heures
- Les minutes doivent être inférieures à 60

## 🎮 Utilisation

1. Invitez le bot sur votre serveur
2. Utilisez `/roulette` pour tenter votre chance
3. Si vous perdez (1/6), vous recevrez un timeout
4. Si vous gagnez, vous pourrez réessayer !

## 🏆 Fonctionnalités spéciales

### Système anti-répétition
Le bot mémorise le dernier résultat de chaque joueur pour éviter qu'un même numéro sorte deux fois de suite.

### Messages dynamiques
Pour les survivants, le bot utilise une variété de messages pour maintenir l'excitation :
- "a survécu de justesse!"
- "peut respirer tranquillement..."
- "a eu chaud!"
- Et bien d'autres...

### Détection vocale
Le bot sait si un joueur est en vocal, permettant des règles spéciales pour ces situations.

## 📝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## ⚠️ Avertissement

Ce bot est conçu pour le divertissement. Assurez-vous que tous les membres de votre serveur sont d'accord avec le concept avant de l'utiliser.

## 🤝 Support

Si vous avez des questions ou des suggestions :
- Ouvrez une [issue](https://github.com/ryzenixx/roulette-russe/issues)
- Contactez moi sur Discord: **ryzenixx**

---

Made with ❤️ by [ryzenixx](https://github.com/ryzenixx)
