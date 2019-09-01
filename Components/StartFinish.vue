<template>
  <div>
    <div v-if="!connected" class="container">
      <div class="card">
        <h3>Your ID:</h3>
        <h5>{{peerID}}</h5>
        <h3>Connect to Opponent:</h3>
        <input v-model="opponentID" placeholder="Enter opponent ID here..." />
        <br />
        <button v-on:click="connectToPeer">Connect</button>
      </div>
    </div>
    <div v-if="gameOver && connected" class="container">
      <div class="card">
        <h1>Game Over</h1>
        <h3 v-if="isPlayerOneWinner">Player One Wins!</h3>
        <h3 v-else-if="!isPlayerOneWinner">Player Two Wins!</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StartFinish"
};
</script>

<style scoped>
.container {
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 999;
  opacity: 0.85;
  background: white;
  height: 100vh;
  width: 100vw;
}
.card {
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
    0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.2em;
  padding: 10px;
  background: rgba(2, 0, 0, 0.3);
}
h1,
h3,
h5 {
  margin: 5px;
}
h5 {
  padding: 5px;
  border-radius: 0.2em;
}
button {
  padding: 8px 12px;
  margin: 8px;
  border-style: none;
  border-radius: 0.3em;
  color: white;
  background: dodgerblue;
  box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
    0 8px 16px -8px rgba(0, 0, 0, 0.3), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);
}
</style>