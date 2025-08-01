<script lang="ts">
  const {flow} = $props();
</script>

<input
        type="checkbox"
        checked={flow.isRunning}
        onchange={flow.toggle}
/>
