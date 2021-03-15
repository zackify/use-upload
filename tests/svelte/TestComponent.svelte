<script lang="ts">
  import { useUpload } from "../../src/svelte";

  export let method: string;
  export let url: string;
  export let headers: any = {};
  export let skipOptionsCb: any = undefined;

  let [upload, state] = useUpload(({ files }) => {
    if (skipOptionsCb) {
      skipOptionsCb();
      return undefined;
    }
    return {
      method,
      url,
      headers,
      body: files[0],
    };
  });
</script>

<div>
  {#if $state.responseHeaders}
    <div>{$state.responseHeaders.Test}</div>
  {/if}
  {#if $state.error}
    <div>{$state.error}</div>
  {/if}
  {#if $state.done}
    <div>done</div>
  {/if}
  {#if $state.loading}
    <div>loading</div>
  {/if}
  {#if $state.loading}
    <div>{$state.progress}% progress</div>
  {/if}

  <input
    type="file"
    aria-label="upload"
    on:change={(e) => {
      if (e.currentTarget.files) {
        upload({ files: e.currentTarget.files });
      }
    }}
  />
</div>
