<template lang="pug">
v-container
 v-flex.xs12.md6.pa-2
      v-card
        v-toolbar(flat)
          v-toolbar-title Installation {{ installation.nom }} n°{{ installation.id }}
        v-card-text
          v-container.pa-0.grid-list-sm
            v-layout
              v-flex S3IC
              v-flex.text-xs-right {{ installation.id }}
            v-layout
              v-flex Raison sociale
              v-flex.text-xs-right {{ installation.nom }}
            v-layout
              v-flex Adresse
              v-flex.text-xs-right {{ installation.adresse }}
            v-layout
              v-flex Activité principale
              v-flex.text-xs-right {{ installation.activite }}
            v-layout
              v-flex Régime Seveso
              v-flex.text-xs-right Haut

</template>

<script>
export default {
  data () {
    return {
      installation: {
        id: '0999.00001',
        nom: 'A',
        activite: 'Fabrication de matrices composites',
        regimeSeveso: '',
        adresse: '123 rue des Fleurs 75000 Paris'
      },
      controles: [
        {
          id: '1',
          date: new Date('2018-11-15'),
          type: 'approfondi',
          annonce: true,
          origine: 'plan_de_controle',
          state: 2 // en cours
        }
      ]
    }
  }
}
</script>
