<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'

// 页面元数据
defineOptions({
  name: 'ReplyReview'
})

const route = useRoute()
const router = useRouter()

// 获取评价ID
const reviewId = route.params.id as string

// 表单数据
const formData = reactive({
  replyContent: ''
})

// 页面状态
const isLoading = ref(false)
const isEdit = ref(false) // 是否为编辑模式

// 评价信息
const reviewInfo = reactive({
  id: reviewId,
  customerName: '匿名用户',
  rating: 5,
  content: '味道很棒！汉堡很新鲜，薯条也很脆，送餐速度很快！',
  createTime: '2024-12-31 12:23:34',
  existingReply: '感谢您的好评！' // 如果有现有回复
})

// 初始化页面数据
function initPageData() {
  // 如果有现有回复，设置为编辑模式
  if (reviewInfo.existingReply) {
    isEdit.value = true
    formData.replyContent = reviewInfo.existingReply
  }
}

// 快速回复模板
const quickReplies = [
  '感谢您的好评！我们会继续努力提供优质服务！',
  '非常抱歉给您带来不好的体验，我们会认真改进！',
  '感谢您的建议，我们会持续改善产品质量！',
  '谢谢您的支持，期待您的再次光临！'
]

// 使用快速回复
function useQuickReply(reply: string) {
  formData.replyContent = reply
}

// 提交回复
async function submitReply() {
  if (!formData.replyContent.trim()) {
    showToast('请输入回复内容')
    return
  }

  if (formData.replyContent.length > 200) {
    showToast('回复内容不能超过200字')
    return
  }

  try {
    isLoading.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    showToast({
      type: 'success',
      message: isEdit.value ? '回复修改成功' : '回复发送成功'
    })

    // 返回详情页
    setTimeout(() => {
      router.back()
    }, 1500)
  }
  catch {
    showToast('操作失败，请重试')
  }
  finally {
    isLoading.value = false
  }
}

// 删除回复
async function deleteReply() {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这条回复吗？',
      confirmButtonText: '删除',
      confirmButtonColor: '#ee0a24'
    })

    isLoading.value = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    showToast({
      type: 'success',
      message: '回复删除成功'
    })

    setTimeout(() => {
      router.back()
    }, 1500)
  }
  catch {
    // 用户取消删除
  }
  finally {
    isLoading.value = false
  }
}

// 返回上一页
function goBack() {
  router.back()
}

// 页面初始化
initPageData()
</script>

<template>
  <div class="reply-review">
    <NavBar
      :title="isEdit ? '修改回复' : '回复评价'"
      left-arrow
      @click-left="goBack"
    />

    <div class="page-content">
      <!-- 评价信息 -->
      <div class="review-info">
        <div class="review-header">
          <span class="customer-name">{{ reviewInfo.customerName }}</span>
          <div class="rating-time">
            <van-rate
              v-model="reviewInfo.rating"
              readonly
              size="14"
              color="#ff6b35"
              void-color="#eee"
            />
            <span class="time">{{ reviewInfo.createTime }}</span>
          </div>
        </div>
        <div class="review-content">
          <p>{{ reviewInfo.content }}</p>
        </div>
      </div>

      <!-- 回复表单 -->
      <div class="reply-form">
        <div class="form-title">
          <van-icon name="edit" size="16" />
          <span>{{ isEdit ? '修改回复' : '回复内容' }}</span>
        </div>

        <van-field
          v-model="formData.replyContent"
          type="textarea"
          placeholder="请输入回复内容..."
          rows="4"
          maxlength="200"
          show-word-limit
          autosize
        />
      </div>

      <!-- 快速回复 -->
      <div class="quick-replies">
        <div class="quick-title">
          <van-icon name="chat-o" size="16" />
          <span>快速回复</span>
        </div>
        <div class="reply-tags">
          <van-tag
            v-for="(reply, index) in quickReplies"
            :key="index"
            type="default"
            size="medium"
            class="reply-tag"
            @click="useQuickReply(reply)"
          >
            {{ reply }}
          </van-tag>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <van-button
          v-if="isEdit"
          type="danger"
          size="large"
          round
          :loading="isLoading"
          @click="deleteReply"
        >
          删除回复
        </van-button>
        <van-button
          type="primary"
          size="large"
          round
          block
          :loading="isLoading"
          @click="submitReply"
        >
          {{ isEdit ? '保存修改' : '发送回复' }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.reply-review {
  min-height: 100vh;
  background: #f8f8f8;

  .page-content {
    padding-bottom: 100px;
  }

  .review-info {
    background: white;
    padding: 16px;
    margin-bottom: 10px;

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;

      .customer-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .rating-time {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;

        .time {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .review-content {
      p {
        font-size: 14px;
        line-height: 1.6;
        color: #666;
        margin: 0;
      }
    }
  }

  .reply-form {
    background: white;
    padding: 16px;
    margin-bottom: 10px;

    .form-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }

  .quick-replies {
    background: white;
    padding: 16px;
    margin-bottom: 10px;

    .quick-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .reply-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .reply-tag {
        cursor: pointer;
        transition: all 0.3s;
        border: 1px solid #e8e8e8;
        background: #f8f8f8;
        color: #666;

        &:hover {
          border-color: #1989fa;
          color: #1989fa;
          background: #f0f8ff;
        }
      }
    }
  }

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: white;
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;

    .van-button {
      flex: 1;
    }
  }
}
</style>
