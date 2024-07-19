
<template>
  <div class="box1">
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '-20px 10px' }"
    >
      Voting system initialization
    </van-divider>

    <!-- 设置垂直间距 -->
    <van-row justify="center">
      <van-col span="10">
        <p class="label"><van-icon name="manager" />主持人地址</p>
        <p class="address">
          <van-tag round type="primary" size="large">{{ host }}</van-tag>
        </p></van-col
      >

      <van-col span="6"
        ><p>剩余投票时间:</p>
        <p>
          <van-tag round type="primary" size="large"
            ><van-count-down
              :time="toMilliseconds(voteTime)"
              format="DD 天 HH 时 mm 分 ss 秒"
          /></van-tag></p
      ></van-col>
    </van-row>

    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
    >
    </van-divider>
    <div>
      <van-cell-group inset>
        <van-field
          v-model="initVoteTime"
          required
          label="投票时间"
          placeholder="请输入投票时间"
        />
      </van-cell-group>
    </div>

    <div class="btn">
      <van-button round block @click="startVoting" type="success"
        >开始投票</van-button
      >
    </div>
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '0px 10px' }"
    >
    </van-divider>

    <div>
      <van-cell-group inset>
        <van-field
          v-model="voterAddress"
          required
          label="投票人地址"
          placeholder="请输入投票人地址"
        />
      </van-cell-group>
    </div>
    <div class="btn">
      <van-button round block @click="mandate" type="success"
        >开始分发选票</van-button
      >
    </div>
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '10px 10px' }"
    >
    </van-divider>
    <div>
      <van-cell-group inset>
        <van-field
          v-model="removeTheAccount"
          required
          label="去除投票人"
          placeholder="请输入去除投票人地址"
        />
      </van-cell-group>
    </div>
    <div class="btn">
      <van-button round block @click="removeAccount" type="success"
        >去除投票人</van-button
      >
    </div>
    <van-divider />
    <van-divider
      :style="{ color: '#1989fa', borderColor: 'red', padding: '10px 10px' }"
    >
    </van-divider>
    <div class="btn">
      <van-button round block @click="endVoting" type="success"
        >结束选票</van-button
      >
    </div>
  </div>
</template>

<script setup>
import useWeb3 from "../hooks/useWeb3";
import { ref, onMounted, createApp } from "vue";
const { web3, voteContract, getAccount } = useWeb3();
import { Field, CellGroup, Notify } from "vant";

const app = createApp();
app.use(Field);
app.use(CellGroup);

// 定义主持人信息
const host = ref("");

const account = ref("");

// 获取主持人信息
const getHost = async () => {
  host.value = await voteContract.methods.host().call();
};

// 选民地址
const voterAddress = ref("");
//去除投票人
const removeTheAccount = ref("");
//投票时间
const voteTime = ref("0");
// 初始化投票时间
const initVoteTime = ref("0");
//结束选票
const endVoting = async () => {
  const account = await getAccount();
  voteContract.methods
    .endVoting()
    .send({ from: account })
    .on("receipt", () => {
      Notify({ type: "success", message: "结束投票成功" });
    })
    .on("error", (error) => {
      Notify({ type: "danger", message: "结束投票失败: " + error.message });
    });
};

// 分发票权
const mandate = async () => {
  const arr = eval(voterAddress.value);
  const account = await getAccount();
  voteContract.methods
    .mandate(arr)
    .send({ from: account })
    .on("receipt", () => {
      Notify({ type: "success", message: "选票分发成功" });
    })
    .on("error", (error) => {
      Notify({ type: "danger", message: "选票分发失败: " + error.message });
    });
};
// 开始投票
const startVoting = async () => {
  const account = await getAccount();
  voteContract.methods
    .startVoting(initVoteTime.value) // 假设投票选项为 0
    .send({ from: account })
    .on("receipt", () => {
      Notify({ type: "success", message: "投票成功" });
    })
    .on("error", (error) => {
      Notify({ type: "danger", message: "投票失败: " + error.message });
    });
};
//去除投票人
const removeAccount = async () => {
  const arr = eval(removeTheAccount.value);
  const account = await getAccount();
  voteContract.methods
    .removeVoter(arr) // 假设投票选项为 0
    .send({ from: account })
    .on("receipt", () => {
      Notify({ type: "success", message: "投票人移除成功" });
    })
    .on("error", (error) => {
      Notify({ type: "danger", message: "投票人移除失败: " + error.message });
    });
};
//获取合约剩余时间
const getVoteTime = async () => {
  voteTime.value = await voteContract.methods.leftTime().call();
};

// 转换秒数为毫秒数
const toMilliseconds = (seconds) => {
  return seconds * 1000;
};

onMounted(async () => {
  await getHost();
  await getVoteTime();
  setInterval(async () => {
    await getVoteTime();
  }, 1000); // 每秒更新一次
});
</script>

<style scoped>
.box1 {
  padding: 10px;
  height: 80vh; /* 使用视口高度的80% */
  overflow-y: scroll; /* 启用垂直滚动条 */
}

.vote-time {
  margin: 20px 0;
}
</style>