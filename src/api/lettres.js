import BaseAPI from './base'

export default class LettresAPI extends BaseAPI {
  _genererHeader () {
    return `
    <div style="float: right">
    Villeurbanne, le ${new Date().toLocaleDateString()}
    </div>

<div style="max-width: 300px; text-align: center">
Direction régionale de l'environnement,<br>
de l'aménagement et du logement<br>
Auvergne-Rhône-Alpes<br>
<br>
Unité Départementale du Rhône
</div>

<br>
Affaire suivie par : ${this.api.store.state.authentication.user.name}<br>
Cellule TESSP<br>
Tél. : 04 72 44 00 00<br>
Télécopie : 04 72 44 00 00<br>
Courriel : ${this.api.store.state.authentication.user.email}<br>
Réf : BLABLA
<br>
`
  }

  _genererFooter (inspection) {
    return `
Je vous prie d'agréer, Monsieur le directeur, l'expression de ma considération distinguée.<br>
<br>
<br>
    <div style="float: right; text-align: center; margin-right: 64px">
    <strong>L'inspecteur des installations classées</strong><br>
    <br>
    <br>
    <strong>${this.api.store.state.authentication.user.name}</strong>
    </div>
<br>
<strong>Monsieur le directeur</strong><br>
${inspection.etablissement.raison}<br>
${inspection.etablissement.adresse}<br>
<br>
<strong>Copies :</strong> Chrono STM, AL<br>
`
  }

  genererLettreAnnonce (inspection) {
    const pointsDeControles = inspection.echanges.map(echange => {
      return ` - <strong>${echange.sujet}</strong> (${echange.referencesReglementaires.join(', ')})<br>`
    }).join('')
    return `
<div style="text-align: justify">
${this._genererHeader()}
<br>
<strong>Recommandé avec AR</strong><br>
<br>
<strong>Objet :</strong> Visite d'inspection - Police des installations classées<br>
<strong>Référence :</strong> Livre 1er, Titre VII du code de l'environnement<br>
<br>
Monsieur le directeur,<br>
<br>
Je vous informe de mon intention de procéder à une visite d’inspection de votre installation « ${inspection.etablissement.nom} »
situé ${inspection.etablissement.adresse} le <strong>${new Date(inspection.date).toLocaleDateString()}</strong> à partir de <strong>9h30</strong>.<br>
<br>
Cette inspection portera sur le respect de votre arrêté préfectoral d'autorisation ainsi que sur les textes applicables
aux rubriques ICPE dont relève l'établissement, à savoir :<br>
${pointsDeControles}<br>
<br>
Dans le cas où cette date ne vous conviendrait pas, je vous invite à me contacter dans les meilleurs délais, afin que
nous convenions éventuellement d'une autre date.<br>
<br>
${this._genererFooter(inspection)}
</div>
`
  }

  genererLettreSuites (inspection) {
    return `
<div style="text-align: justify">
${this._genererHeader()}
<br>
<strong>Objet :</strong> Visite d'inspection du ${new Date(inspection.date).toLocaleDateString()}<br>
<strong>P.J. :</strong> Copie du rapport d'inspection<br>
<br>
Monsieur le directeur,<br>
<br>
L'inspection des installations classées a réalisé une visite d'inspection de votre établissement situé ${inspection.etablissement.adresse}, le ${new Date(inspection.date).toLocaleDateString()}.<br>
<br>
En application de l'article L.514-5 du code de l'environnement, je vous prie de bien vouloir trouver ci-joint une copie du rapport que je transmets à monsieur le préfet du département du Rhône.<br>
<br>
Cette visite d'inspection a mis en exergue des non-conformités détaillées dans le rapport joint. Je vous saurais gré
de bien vouloir me tenir informé sous 1 mois des suites que vous donnerez à cette visite en fournissant les éléments et/ou un plan d'actions visant à répondre aux non-conformités et aux observations formulées. Cet éventuel plan d'actions
devra respecter les délais mentionnés dans le rapport ci-joint.<br>
<br>
Sauf réserve de votre part motivée sous un délai de quinze jours par des considérations prévues par la loi 2000-321 du 12 avril 2000 relative aux droits des ciyoyens dans les relations avec les administrations, et des articles L.110-1 4°, L.124-1, L125-1, L.125-4, et L.521-7 du code de l'environnement, le rapport de contrôle joint au présent courrier sera publié sur le site Internet de l'inspection des installations classées.<br>
<br>
${this._genererFooter(inspection)}
</div>
`
  }
}
