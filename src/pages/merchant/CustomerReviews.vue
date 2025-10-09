<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Rate from './components/Rate.vue'

// 页面元数据
defineOptions({
  name: 'CustomerReviews'
})

const router = useRouter()

// 评价统计数据
const reviewStats = reactive({
  averageRating: 4.9,
  totalReviews: 1247,
  ratingDistribution: {
    5: 1089,
    4: 98,
    3: 35,
    2: 15,
    1: 10
  }
})

// 筛选条件
const filterOptions = ref([
  { label: '全部评价', value: 'all', count: 1247 },
  { label: '五星好评', value: '5', count: 1089 },
  { label: '四星', value: '4.5', count: 98 },
  { label: '三星', value: '3', count: 35 },
  { label: '二星', value: '2', count: 15 },
  { label: '一星', value: '1', count: 10 }
])

const activeFilter = ref(0)

// 评价列表数据
const reviewList = ref([
  {
    id: '1',
    customerName: '匿名用户',
    avatar: '',
    rating: 5,
    content: '味道很棒！汉堡很新鲜，薯条也很脆，送餐速度很快！',
    images: [
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡1',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡2',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡3'
    ],
    createTime: '2024-12-31 12:23:34',
    hasReply: false,
    isAnonymous: true
  },
  {
    id: '2',
    customerName: '匿名用户',
    avatar: '',
    rating: 5,
    content: '非常满意！汉堡肉质鲜美，配菜丰富，包装也很用心，会继续支持的！',
    images: [
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡4',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡5',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡6'
    ],
    createTime: '2024-12-30 18:45:22',
    hasReply: true,
    isAnonymous: true
  },
  {
    id: '3',
    customerName: '匿名用户',
    avatar: '',
    rating: 5,
    content: '真的很好吃！汉堡很大个，料很足，薯条也很香脆，下次还会再来的。服务态度也很好，配送很及时，包装很仔细，没有洒漏。总体来说非常满意，五星好评！',
    images: [
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡7',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡8',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡9',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡10',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡11',
      'https://via.placeholder.com/100x100/FFB800/FFFFFF?text=汉堡12'
    ],
    createTime: '2024-12-29 15:30:18',
    hasReply: false,
    isAnonymous: true
  }
])

// 切换筛选条件
function handleFilterChange(index: number) {
  activeFilter.value = index
  // 这里可以添加筛选逻辑
}

// 查看评价详情
function viewReviewDetail(reviewId: string) {
  router.push(`/merchant/review-detail/${reviewId}`)
}

// 回复评价
function replyReview(reviewId: string) {
  router.push(`/merchant/reply-review/${reviewId}`)
}

// 返回上一页
function goBack() {
  router.back()
}
</script>

<template>
  <div class="customer-reviews">
    <NavBar title="顾客评价" left-arrow @click-left="goBack" />

    <div class="reviews-content">
      <!-- 评价统计 -->
      <div class="review-stats">
        <div class="rating-overview">
          <div class="rating-score">
            <span class="score">{{ reviewStats.averageRating }}</span>
            <div class="rating-cont">
              <Rate :average-rating="reviewStats.averageRating" />
              <span class="summary">根据评价计算所得</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选标签 -->
      <div class="filter-tabs">
        <van-tabs v-model:active="activeFilter" @change="handleFilterChange">
          <van-tab
            v-for="(option, index) in ['未回复的评价', '全部评价']"
            :key="index"
            class="filter-tab"
          >
            <template #title>
              <div class="tab-title" :class="[{ active: index === activeFilter }]">
                {{ option }}
              </div>
            </template>
            <div class="tab-content">
              <ul class="review-count">
                <li
                  v-for="(item, index) in filterOptions"
                  :key="index"
                  class="count-item" :class="[{ active: index === 0 }]"
                >
                  <span class="label">{{ item.label }}</span>
                  <span class="count">{{ item.count }}</span>
                </li>
              </ul>
            </div>
          </van-tab>
        </van-tabs>
      </div>

      <!-- 评价列表 -->
      <div class="review-list">
        <div
          v-for="review in reviewList"
          :key="review.id"
          class="review-item"
          @click="viewReviewDetail(review.id)"
        >
          <div class="review-header">
            <div class="user-info">
              <van-image
                v-if="!review.isAnonymous && review.avatar"
                :src="review.avatar"
                class="avatar"
                round
                width="40"
                height="40"
              />
              <div v-else class="avatar-placeholder">
                <van-icon name="user-o" size="20" color="#999" />
              </div>
              <div class="user-details">
                <span class="username">{{ review.customerName }}</span>
                <div class="rating-time">
                  <van-rate
                    v-model="review.rating"
                    readonly
                    size="12"
                    color="#ff6b35"
                    void-color="#eee"
                  />
                  <span class="time">{{ review.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="actions">
              <van-button
                v-if="!review.hasReply"
                type="primary"
                size="mini"
                round
                @click.stop="replyReview(review.id)"
              >
                回复
              </van-button>
              <span v-else class="replied">已回复</span>
            </div>
          </div>

          <div class="review-content">
            <p class="review-text">
              {{ review.content }}
            </p>

            <div v-if="review.images.length > 0" class="review-images">
              <van-image
                v-for="(image, index) in review.images"
                :key="index"
                :src="image"
                class="review-image"
                width="60"
                height="60"
                fit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.customer-reviews {
  min-height: 100vh;
  background: #eef0f3;

  .reviews-content {
    padding-bottom: 20px;
  }

  .review-stats {
    width: 100%;
    height: 134px;
    padding: 32px 24px;
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;

    .rating-overview {
      .rating-score {
        display: flex;
        align-items: center;

        .score {
          font-weight: bold;
          font-size: 48px;
          color: #ff3d3d;
          margin-right: 60px;
        }

        .rating-cont {
          display: flex;
          flex-direction: column;
          align-items: center;
          .summary {
            margin-top: 14px;
            font-weight: 400;
            font-size: 24px;
            color: #888888;
          }
        }
      }
    }
  }

  .filter-tabs {
    background: #fff;
    margin-top: 12px;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    :deep(.van-tabs__wrap) {
      height: 104px;
      border-bottom: 1px solid #eee;
      .van-tabs__nav {
        padding-left: 0;
        padding-right: 0;
      }

      .van-tabs__line {
        --van-tabs-bottom-bar-width: 70px;
        background: #ff5656;
      }

      .van-tab__text {
        display: block;
      }

      .van-tab {
        padding: 0 4px;
      }

      .tab-title {
        font-weight: 400;
        font-size: 30px;
        color: #333333;
        text-align: center;

        &.active {
          font-weight: 600;
          font-size: 30px;
          color: #ff5656;
        }
      }
    }

    .tab-content {
      padding: 54px 32px 32px;

      .review-count {
        display: flex;
        flex-wrap: wrap;

        .count-item {
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: 212px;
          height: 64px;
          background: #f4f5f7;
          border-radius: 12px;
          font-weight: 400;
          font-size: 28px;
          color: #151515;
          cursor: pointer;
          &:not(:nth-child(3n + 1)) {
            margin-left: 24px;
          }
          &:nth-child(n + 4) {
            margin-top: 24px;
          }

          &.active {
            color: #ff5656;
            background: #fff7f7;
            border: 2px solid #ff5656;
          }
        }
      }
    }
  }

  .review-list {
    .review-item {
      background: white;
      margin-bottom: 10px;
      padding: 16px;
      cursor: pointer;

      &:active {
        background: #f5f5f5;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        .user-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;

          .avatar-placeholder {
            width: 40px;
            height: 40px;
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
              margin-bottom: 4px;
            }

            .rating-time {
              display: flex;
              align-items: center;
              gap: 8px;

              .time {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }

        .actions {
          .replied {
            font-size: 12px;
            color: #999;
            padding: 4px 8px;
            background: #f0f0f0;
            border-radius: 12px;
          }
        }
      }

      .review-content {
        .review-text {
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          margin: 0 0 12px 0;
        }

        .review-images {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .review-image {
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
