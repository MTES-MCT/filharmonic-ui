import BaseAPI from './base'

export default class LettresAPI extends BaseAPI {
  genererLettreAnnonce (inspection) {
    const pointsDeControles = inspection.echanges.map(echange => {
      return ` - <strong>${echange.sujet}</strong> (${echange.referencesReglementaires.join(', ')})<br>`
    }).join('')
    let lettre = `
<div style="text-align: justify">
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
</div>
`
    return lettre
  }
}
