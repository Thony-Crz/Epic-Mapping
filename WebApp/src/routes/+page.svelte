<script lang="ts">
  import BlueCard from '$ui/components/BlueCard.svelte';
  import YellowCard from '$ui/components/YellowCard.svelte';
  import GreenCard from '$ui/components/GreenCard.svelte';
  import GreyCard from '$ui/components/GreyCard.svelte';
</script>

<BlueCard title="Authentification">
  <YellowCard title="Saisie login">
    <GreenCard title="L'utilisateur entre un identifiant valide" />
    <GreenCard title="L'utilisateur entre un identifiant valide" />
    <GreenCard title="L'utilisateur entre un identifiant valide" />
    <GreyCard title="Et si le champ est vide ?" />
  </YellowCard>

  <YellowCard title="Saisie mot de passe">
    <GreenCard title="Le mot de passe est correct" />
    <GreyCard title="Mot de passe oublié" />
  </YellowCard>
</BlueCard>
