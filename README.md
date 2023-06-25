<i>Ce fichier README est en mode brouillon.</i>

## TODO
- script de déploiement
- Solidity : natspec + ddos gas limit + optimisation + TU
- Front : l’enregistrement d’une liste blanche d'électeurs. 
- Front : à l'administrateur de commencer la session d'enregistrement de la proposition.
- Front : aux électeurs inscrits d’enregistrer leurs propositions.
- Front : à l'administrateur de mettre fin à la session d'enregistrement des propositions.
- Front : à l'administrateur de commencer la session de vote.
- Front : aux électeurs inscrits de voter pour leurs propositions préférées.
- Front : à l'administrateur de mettre fin à la session de vote.
- Front : à l'administrateur de comptabiliser les votes.
- Front : à tout le monde de consulter le résultat.
- Front : gérer les états (bouton visible ou non)
- Front : écouter les events pour le workflow status / voters pour l'owner / lister les proposals dispo / nb Voters + nb Proposals + nb votes
- vidéo
- déploiement prod (Vercel)

## Conception
[Balsamiq](https://balsamiq.com/)
![Alt text](conception.png)

## Commandes passées
```bash
truffle unbox react
cd client
npm i bootstrap@5.3.0 reactstrap
cd truffle
npm i @openzeppelin/contracts
```

Pour tester :  
```bash
ganache -m '...'
cd truffle
truffle migrate
cd ../client
npm start
```

Pour aller plus loin, un script est disponible pour vérifier que l'interaction avec le Smart Contract est possible :  
```bash
truffle migrate
truffle exec scripts/get_voting_status.js
```