<template>
  <div
    id="emote-generator"
    class="container"
    data-theme="dark"
  >
    <div class="columns is-centered">
      <emote-options
        class="column is-half"
        :blueprints="blueprints"
        :characters="characters"
        :parts="parts"
      />

      <emote-preview
        class="column is-half"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStore } from "../stores/emoteStore";
import EmoteOptions from "./EmoteOptions.vue";
import EmotePreview from "./EmotePreview.vue";

const store = useStore();
const { blueprints, characters, parts } = storeToRefs(store);

// Initial population of blueprints.
store.fetchBlueprints();

</script>

<style lang="scss">
  #emote-generator {
    color: #DDD;

    label {
      text-align: left;
    }

    select {
      width: 100%
    }

    section {
      padding: 2em;
    }

    // Bulma Override
    label {
      color: #DDD !important;
      &.radio:hover {
        color: #FFF !important;
      }
    }
  }
</style>
