<script setup>
import { ref, onMounted } from "vue";
import useWeb3 from "@/hooks/useWeb3";
const { web3, voteContract, getAccount } = useWeb3();

const account = ref("");

// 选民信息
const voterInfo = ref({});

// 受托人地址
const delegatorAddress = ref("");

// 当前Host
const host = ref("");
// 新的Host
const newHost = ref("");
//是否为Host
const isHost = ref(false);
// 全部投票人地址
const VoteAddresses = ref([]);

// 获取全部投票人地址
const getVoteAddresses = async () => {
  VoteAddresses.value = await voteContract.methods.getVotersInfo().call();
};

// 获取当前Host并判断是否为Host
const getHost = async () => {
  account.value = await getAccount();
  host.value = await voteContract.methods.host().call();
  if (account.value == host.value) {
    isHost.value = true;
  } else {
    isHost.value = false;
  }
};

//修改Host
const renewHost = async () => {
  if (isHost.value) {
    voteContract.methods
      .renewHost(newHost.value)
      .send({ from: account.value })
      .on("receipt", (event) => {
        console.log("转让Host成功！");
      });
  }
};

const getVoteInfo = async () => {
  account.value = await getAccount();
  voterInfo.value = await voteContract.methods.voters(account.value).call();
};

const delegate = () => {
  // 去除引号，确保地址格式正确
  const address = delegatorAddress.value.replace(/['"]+/g, "");
  voteContract.methods
    .delegate(address)
    .send({ from: account.value })
    .on("receipt", (event) => {
      console.log("委托成功！");
    });
};

onMounted(async () => {
  await getVoteInfo();
  await getHost();
  await getVoteAddresses();
});
</script>

<template>
  <div class="scrollable-box box3">
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '-20px 10px' }"
    >
      Account information
    </van-divider>
    <van-space>
      <p>
        <van-tag plain type="primary" color="green" size="large"
          >当前账户</van-tag
        >
      </p>
      <p class="label"></p>
      <van-tag round type="primary" size="large">{{ account }}</van-tag>
    </van-space>
    <br />
    <van-space>
      <p>
        <van-tag plain type="primary" color="green" size="large"
          >账户票数</van-tag
        >
      </p>
      <p class="label"></p>

      <van-tag round type="primary" size="large">{{
        voterInfo.amount
      }}</van-tag>
    </van-space>
    <br />
    <van-space>
      <p>
        <van-tag plain type="primary" color="green" size="large"
          >委托账户</van-tag
        >
      </p>
      <p class="label"></p>

      <van-tag round type="primary" size="large">{{
        voterInfo.delegator
      }}</van-tag>
    </van-space>
    <br />
    <van-space>
      <p>
        <van-tag plain type="primary" color="green" size="large"
          >是否已投票</van-tag
        >
      </p>
      <p class="label"></p>
      <van-tag round type="primary" size="large">{{
        voterInfo.isVoted
      }}</van-tag>
    </van-space>
    <br />
    <van-space>
      <p>
        <van-tag plain type="primary" color="green" size="large"
          >投票ID</van-tag
        >
      </p>
      <p class="label"></p>
      <van-tag round type="primary" size="large">{{
        voterInfo.targetId
      }}</van-tag>
    </van-space>
    <br />
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
    >
    </van-divider>

    <div class="btn">
      <van-cell-group inset>
        <van-field
          v-model="delegatorAddress"
          required
          label="受托人地址"
          placeholder="请输入受托人地址"
        />
      </van-cell-group>
      <van-button round block @click="delegate" type="success"
        >委托他人代投</van-button
      >
    </div>

    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
    >
    </van-divider>
    <div v-if="isHost" class="btn">
      <van-cell-group inset>
        <van-field
          v-model="newHost"
          required
          label="新Host地址"
          placeholder="请输入新Host地址"
        />
      </van-cell-group>
      <van-button round block @click="renewHost" type="success"
        >修改Host</van-button
      >
    </div>
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
    >
    </van-divider>
    <van-tag round color="green" type="primary" size="large"
      >全部投票人地址</van-tag
    >
    <van-row justify="space-around">
      <div class="vote-addresses-container">
        <ul>
          <li v-for="address in VoteAddresses" :key="address">
            {{ address }}
          </li>
        </ul>
      </div>
    </van-row>
  </div>
</template>

<style scoped>
.scrollable-box {
  max-height: 700px; /* 固定高度，适当调整 */
  overflow-y: auto; /* 超出区域时滚动查看 */
}

.vote-addresses-container {
  width: 100%; /* 固定宽度，适当调整 */
  max-height: 200px; /* 固定高度 */
  overflow-y: auto; /* 超出区域时滚动查看 */
  border: 1px solid #ccc; /* 边框样式，可选 */
  padding: 10px; /* 内边距，可选 */
}

.vote-addresses-container ul {
  list-style-type: none; /* 去掉默认的列表样式 */
  padding: 0; /* 去掉默认的内边距 */
}

.vote-addresses-container li {
  margin: 5px 0; /* 列表项间距 */
}
</style>