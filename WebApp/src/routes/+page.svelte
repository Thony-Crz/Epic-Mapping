<script lang="ts">
  import BlueCard from '$ui/components/BlueCard.svelte';
  import YellowCard from '$ui/components/YellowCard.svelte';
  import GreenCard from '$ui/components/GreenCard.svelte';
  import GreyCard from '$ui/components/GreyCard.svelte';
</script>

<div class="p-8 space-y-4">
  <BlueCard title="Connexion utilisateur" />
  <YellowCard title="Saisie des identifiants"/>
  <GreenCard title="L'utilisateur saisit son mot de passe" />
  <GreyCard title="Et si l'utilisateur oublie son mot de passe ?" />
</div>
