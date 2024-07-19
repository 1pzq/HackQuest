<script setup>
import useWeb3 from "@/hooks/useWeb3";
import { ref, onMounted } from "vue";
const { web3, voteContract, getAccount } = useWeb3();

// 看板信息
const board = ref([]);
// 添加选举人
const addElected = ref([]);
// 去除选举人
const removeElected = ref([]);
// 查看最后的Winner
const Winner = ref([]);

const account = ref("");

const getBoardInfo = async () => {
  account.value = await getAccount();
  board.value = await voteContract.methods.getBoardInfo().call();
};

//添加选举人
const addTheElected = async () => {
  const arr = eval(addElected.value);
  const account = await getAccount();
  voteContract.methods
    .addTheElected(arr)
    .send({ from: account })
    .on("receipt", () => {
      console.log("添加选举人成功");
    });
};
//去除选举人
const removeTheElected = async () => {
  const arr = eval(removeElected.value);
  const account = await getAccount();
  voteContract.methods
    .removeElected(arr)
    .send({ from: account })
    .on("receipt", () => {
      console.log("去除选举人成功");
    });
};
//获取最后的决胜者
const getTheWinner = async () => {
  Winner.value = await voteContract.methods.getWinInfo().call();
};

//进行投票
const vote = async (index) => {
  const account = await getAccount();
  const result = await voteContract.methods.vote(index).send({ from: account });
};

const initEventListen = () => {
  voteContract.events
    .voteSuccess({ fromBlock: 0 }, (err, event) => {
      console.log("监听执行");
      console.log(event);
    })
    .on("data", (event) => {
      console.log("智能合约触发的事件：", event.returnValues);
    });
};

onMounted(() => {
  initEventListen();
  getBoardInfo();
});
</script>

<template>
  <div class="scrollable-box box2">
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '-20px 10px' }"
    >
      Voting board
    </van-divider>

    <van-cell
      :title="item.name"
      icon="shop-o"
      v-for="(item, index) in board"
      :key="index"
    >
      <template #right-icon>
        <van-button @click="vote(index)">{{ item.totalAmount }}</van-button>
      </template>
    </van-cell>
  </div>
  <div>
    <van-cell-group inset>
      <van-field
        v-model="addElected"
        required
        label="添加选举人"
        placeholder="请输入选举人地址"
      />
    </van-cell-group>
  </div>
  <div class="btn">
    <van-button round block @click="addTheElected" type="success"
      >添加选举人</van-button
    >
  </div>
  <van-divider
    :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
  >
  </van-divider>
  <div>
    <van-cell-group inset>
      <van-field
        v-model="removeElected"
        required
        label="去除选举人"
        placeholder="请输入去除的选举人"
      />
    </van-cell-group>
  </div>

  <div class="btn">
    <van-button round block @click="removeTheElected" type="success"
      >去除选举人</van-button
    >
  </div>
  <van-divider
    :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
  >
  </van-divider>
  <div>
    <van-cell required title="最后的胜者" :value="Winner"></van-cell>
  </div>
  <div>
    <van-button round block @click="getTheWinner" type="success"
      >查看最后的Winner</van-button
    >
  </div>
</template>

<style scoped>
.scrollable-box {
  max-height: 350px; /* 固定高度，适当调整 */
  overflow-y: auto; /* 超出区域时滚动查看 */
}
</style>