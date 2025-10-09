<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 页面元数据
defineOptions({
  name: 'ReviewDetail'
})

const route = useRoute()
const router = useRouter()

// 获取评价ID
const reviewId = route.params.id as string

// 评价详情数据
const reviewDetail = reactive({
  id: reviewId,
  orderId: '1502782032873063',
  customerName: '匿名用户',
  avatar: '',
  rating: 5,
  content: '味道很棒！汉堡很新鲜，薯条也很脆，送餐速度很快！',
  images: [
    'https://via.placeholder.com/200x200/FFB800/FFFFFF?text=汉堡1',
    'https://via.placeholder.com/200x200/FFB800/FFFFFF?text=汉堡2',
    'https://via.placeholder.com/200x200/FFB800/FFFFFF?text=汉堡3'
  ],
  createTime: '2024-12-31 12:23:34',
  orderInfo: {
    products: ['经典牛肉汉堡', '薯条', '可乐'],
    totalAmount: 45.8
  },
  merchantReply: {
    content: '感谢您的好评！',
    createTime: '2024-12-31 14:30:00'
  },
  isAnonymous: true
})

// 显示大图预览
function previewImage(_index: number) {
  // 使用 Vant 的 ImagePreview 组件
  // ImagePreview(reviewDetail.images, index)
}

// 回复评价
function replyReview() {
  router.push(`/merchant/reply-review/${reviewId}`)
}

// 返回上一页
function goBack() {
  router.back()
}
</script>

<template>
  <div class="review-detail">
    <NavBar title="评价详情" left-arrow @click-left="goBack" />

    <div class="detail-content">
      <!-- 订单信息 -->
      <div class="order-info">
        <div class="info-row">
          <span class="label">订单编号：</span>
          <span class="value">{{ reviewDetail.orderId }}</span>
        </div>
        <div class="info-row">
          <span class="label">商品信息：</span>
          <span class="value">{{ reviewDetail.orderInfo.products.join('、') }}</span>
        </div>
        <div class="info-row">
          <span class="label">订单金额：</span>
          <span class="value">¥{{ reviewDetail.orderInfo.totalAmount }}</span>
        </div>
      </div>

      <!-- 评价内容 -->
      <div class="review-content">
        <div class="review-header">
          <div class="user-info">
            <van-image
              v-if="!reviewDetail.isAnonymous && reviewDetail.avatar"
              :src="reviewDetail.avatar"
              class="avatar"
              round
              width="50"
              height="50"
            />
            <div v-else class="avatar-placeholder">
              <van-icon name="user-o" size="24" color="#999" />
            </div>
            <div class="user-details">
              <span class="username">{{ reviewDetail.customerName }}</span>
              <div class="rating-time">
                <van-rate
                  v-model="reviewDetail.rating"
                  readonly
                  size="16"
                  color="#ff6b35"
                  void-color="#eee"
                />
                <span class="time">{{ reviewDetail.createTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="review-text">
          <p>{{ reviewDetail.content }}</p>
        </div>

        <!-- 评价图片 -->
        <div v-if="reviewDetail.images.length > 0" class="review-images">
          <van-image
            v-for="(image, index) in reviewDetail.images"
            :key="index"
            :src="image"
            class="review-image"
            width="100"
            height="100"
            fit="cover"
            @click="previewImage(index)"
          />
        </div>
      </div>

      <!-- 商家回复 -->
      <div v-if="reviewDetail.merchantReply" class="merchant-reply">
        <div class="reply-header">
          <van-icon name="shop-o" size="16" color="#1989fa" />
          <span class="reply-title">商家回复</span>
          <span class="reply-time">{{ reviewDetail.merchantReply.createTime }}</span>
        </div>
        <div class="reply-content">
          <p>{{ reviewDetail.merchantReply.content }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <van-button
          v-if="!reviewDetail.merchantReply"
          type="primary"
          size="large"
          round
          block
          @click="replyReview"
        >
          回复评价
        </van-button>
        <van-button
          v-else
          type="default"
          size="large"
          round
          block
          @click="replyReview"
        >
          修改回复
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.review-detail {
  min-height: 100vh;
  background: #f8f8f8;

  .detail-content {
    padding-bottom: 80px;
  }

  .order-info {
    background: white;
    padding: 16px;
    margin-bottom: 10px;

    .info-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #666;
        min-width: 80px;
      }

      .value {
        color: #333;
        flex: 1;
      }
    }
  }

  .review-content {
    background: white;
    padding: 16px;
    margin-bottom: 10px;

    .review-header {
      margin-bottom: 16px;

      .user-info {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .avatar-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-details {
          .username {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            display: block;
            margin-bottom: 8px;
          }

          .rating-time {
            display: flex;
            align-items: center;
            gap: 12px;

            .time {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }

    .review-text {
      margin-bottom: 16px;

      p {
        font-size: 15px;
        line-height: 1.6;
        color: #333;
        margin: 0;
      }
    }

    .review-images {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .review-image {
        border-radius: 8px;
        cursor: pointer;
      }
    }
  }

  .merchant-reply {
    background: white;
    padding: 16px;
    margin-bottom: 10px;

    .reply-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .reply-title {
        font-size: 14px;
        font-weight: 500;
        color: #1989fa;
      }

      .reply-time {
        font-size: 12px;
        color: #999;
        margin-left: auto;
      }
    }

    .reply-content {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #1989fa;

      p {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        margin: 0;
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
  }
}
</style>
