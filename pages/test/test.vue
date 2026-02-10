<template>
    <view class="poster-page">
        <view class="top">
            <view v-if="isType">{{ $t('poster.recentTest') }}</view>
            <view v-else @click="selectAll">{{ isSelectAll ? $t('poster.deselectAll') : $t('poster.selectAll') }}</view>
            <view v-if="isType" hover-class="none" @click="enterManageMode">
                {{ $t('poster.manage') }}
            </view>
            <view v-else class="action-controls">
                <view @click="exitManageMode">
                    {{ $t('common.cancel') }}
                </view>
            </view>
        </view>
        <view class="category-bar">
            <scroll-view class="category-scroll" scroll-x show-scrollbar="false" scroll-with-animation
                :scroll-left="categoryScrollLeft">
                <view class="category-track">
                    <view v-for="(item, index) in categoryList" :key="index" :id="`category-${index}`"
                        class="category-pill" :class="{ active: currentCategory === index }"
                        @click="handleCategoryClick(item, index)">
                        <text class="category-pill-text">{{ item.label }}</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <scroll-view class="poster-list-wrapper" scroll-y @scrolltolower="loadMore" :lower-threshold="100">
            <view class="poster-list-container">
                <view v-for="(item, index) in posterList" :key="item.id || index"
                    :class="['poster', { 'answer': item.prompt_template.template_type == 'answer' }]"
                    @click="isType ? handlePosterClick(item, index, item.prompt_template.template_type) : toggleSelect(item)">
                    <!-- 选中图标 -->
                    <image v-if="!isType" class="select-icon" :src="item.isActive
                        ? '/static/my/yixuan.png'
                        : '/static/my/weixuan.png'
                        " mode="aspectFit"></image>

                    <!-- 左侧图片 -->
                    <view class="left">
                        <image v-if="item.prompt_template.template_type == 'answer'" :src="item.file_url"
                            mode="scaleToFill"
                            :class="{ 'poster-image--blur': item.status === 'waiting' || item.status === 'error', }">
                        </image>
                        <image
                            v-else-if="item.prompt_template.template_type == 'social' || item.prompt_template.template_type == 'physical'"
                            :src="item.character_image_url" mode="scaleToFill"
                            :class="{ 'poster-image--blur': item.status === 'waiting' || item.status === 'error' }">
                        </image>
                        <image v-else-if="item.prompt_template.template_type == 'tarot_card'"
                            :src="$getImg('index/tarotcards')" mode="scaleToFill"
                            :class="{ 'poster-image--blur': item.status === 'waiting' || item.status === 'error', 'tarot_card': item.prompt_template.template_type == 'tarot_card' }">
                        </image>
                        <image v-else-if="item.prompt_template.template_type == 'mbti'" :src="$getImg('add/mbtiimages')"
                            mode="scaleToFill" :class="{ 'mbti': item.prompt_template.template_type == 'mbti' }">
                        </image>
                        <view v-else class="poster-placeholder">
                            <text class="poster-placeholder-text">{{ getStatusText(item.status) }}</text>
                        </view>
                    </view>

                    <!-- 状态遮罩 - 铺满整个卡片区域 -->
                    <view class="status-overlay"
                        v-if="(item.status === 'waiting' || item.status === 'error') && item.prompt_template.template_type !== 'mbti'">
                        <!-- 右上角状态标签 -->
                        <view v-if="item.status === 'waiting' || item.status === 'error'" class="status-badge"
                            @click.stop="index == 1 ? handleRetryClick(item) : null">
                            <text class="status-badge-text">{{ getStatusTitle(item.status) }}</text>
                        </view>
                    </view>

                    <!-- 右侧内容 -->
                    <view class="right">
                        <!-- 鉴渣类型 -->
                        <template
                            v-if="item.prompt_template.template_type == 'social' || item.prompt_template.template_type == 'physical'">
                            <view class="num">{{ $t('poster.cheatScore') }}{{ item.score }}%</view>
                            <view class="details">
                                <text>{{ item.summary }}</text>
                                <text v-if="isType" class="look">{{
                                    $t('poster.viewPoster') }} {{
                                        '>>' }}</text>
                            </view>
                        </template>

                        <!-- 答案之书类型和塔罗牌 -->
                        <template
                            v-if="item.prompt_template.template_type == 'answer' || item.prompt_template.template_type == 'tarot_card'">
                            <view class="num">{{ item.summary }}</view>
                            <view class="details" style="margin-top: 20rpx;"
                                v-if="item.prompt_template.template_type == 'answer'">
                                <text style="font-weight: 100;">{{ $t('poster.answerLabel') }}</text>
                                "{{ item.mbti_list[0] || $t('poster.defaultAnswer') }}"
                                <text v-if="isType" class="look">{{ $t('poster.viewAnswer') }} {{ '>>' }}</text>
                            </view>
                            <view class="details" style="margin-top: 20rpx;" v-else>
                                <text v-if="isType" class="look">{{ $t('poster.viewAnswer') }}{{ '>>' }}</text>
                            </view>
                        </template>
                        <!-- mbti单人 -->
                        <template v-if="item.prompt_template.template_type == 'mbti'">
                            <block v-if="item.mbti_list[0]?.templates[0].template_type == 'single'">
                                <view class="num" style="margin-left: 5rpx;">MBTI测试</view>
                                <view class="details" style="margin-top: 30rpx;font-size: 30rpx;">
                                    <text>{{ $t('poster.personalityIs') }}</text>
                                    <text v-if="isType" style="font-weight: 100;">立即查看 {{ '>>' }}</text>
                                </view>
                            </block>
                            <!-- mbti双人 -->
                            <block v-else>
                                <view class="num" style="margin-left:5rpx;">MBTI双人版测试</view>
                                <view class="details" style="margin-top: 30rpx;font-size: 30rpx;">
                                    <text v-if="item.mbti_list[0].other_status == 'waiting'">{{
                                        $t('mbti.waitingForOtherResult') }}</text>
                                    <text v-if="item.mbti_list[0].other_status == 'exit'">{{
                                        $t('mbti.otherNotCompleted') }}</text>
                                    <text v-if="!item.mbti_list[0].other_status">{{
                                        $t('mbti.waitingForOthersToJoin') }}</text>
                                    <text v-if="item.mbti_list[0].other_status == 'done'">
                                        双方均已完成答题
                                    </text>
                                    <!-- 是房主 -->
                                    <text v-if="isType && item.mbti_list[0].master" style="font-weight: 100;margin-left: 20rpx;">
                                        {{ item.mbti_list[0].other_status == 'exit' ? $t('mbti.reInvite') :
                                            !item.mbti_list[0].other_status ? $t('mbti.viewInviteCode') + ' ' :
                                                $t('poster.viewDetails') }} {{ '>>' }}</text>
                                    <!-- 不是房主  -->
                                    <text v-if="isType && !item.mbti_list[0].master && item.mbti_list[0].other_status == 'done'" style="font-weight: 100;margin-left: 20rpx;">
                                        立即查看{{ '>>' }}</text>
                                </view>
                            </block>


                        </template>
                    </view>
                </view>
                <!-- <view v-if="loading" class="loading-more">{{ $t('poster.loadingMore') }}</view> -->
                <view v-if="!hasMore && posterList.length > 0" class="no-more">{{ $t('poster.noMore') }}</view>
                <view class="no-empt" v-if="posterList.length == 0">
                    <image :src="$getImg('index/no-empt')" mode="widthFix" />
                    <view class="title">{{ $t('poster.emptyMessage') }}</view>
                    <view class="btn" @click="path">{{ $t('poster.goToTest') }}</view>
                </view>
            </view>
        </scroll-view>
    </view>

    <view class="action-bar" v-if="!isType">
        <button class="action-btn" hover-class="none" @click="delItems">
            {{ selectedCount ?
                `${$t('poster.deleteSelectedPrefix')}${selectedCount}${$t('poster.deleteSelectedSuffix')}` :
                $t('poster.delete') }}
        </button>
    </view>
    <up-popup :show="showDelPopup" mode="center">
        <view class="del-popup-content">
            <image class="del-popup-icon" src="/static/my/shanchu.png"></image>
            <view class="del-popup-title">
                {{
                    selectedCount > 1
                        ?
                        `${$t('poster.confirmDeleteMultiplePrefix')}${selectedCount}${$t('poster.confirmDeleteMultipleSuffix')}`
                        : $t('poster.confirmDelete')
                }}
            </view>
            <view class="del-popup-actions">
                <view class="del-popup-btn cancel" @click="showDelPopup = false">{{ $t('common.cancel') }}</view>
                <view class="del-popup-btn confirm" @click="confirmDelete">{{ $t('common.confirm') }}</view>
            </view>
        </view>
    </up-popup>

    <up-popup :show="showDelPopup2" mode="center">
        <view class="del-popup-content">
            <image class="del-popup-icon" src="/static/my/gantanhao.png"></image>
            <view class="del-popup-title">{{ $t('poster.posterFailed') }}</view>
            <view class="del-popup-actions">
                <view class="del-popup-btn cancel" @click="handleFailCancel">{{ $t('common.cancel') }}</view>
                <view class="del-popup-btn confirm" @click="handleRetryEdit">{{ $t('poster.reAnalyze') }}</view>
            </view>
        </view>
    </up-popup>

    <IndexProup :show="showProgress" @close="handleProgressClose" :cha="true" :height="125">
        <template #content>
            <view class="content">
                <view class="num">{{ $t('poster.analyzingPercent') }}{{ progress }}{{ $t('poster.analyzingPercentUnit')
                }}</view>
                <view class="progress-wrapper">
                    <view class="custom-progress">
                        <view class="progress-track">
                            <view class="progress-fill" :style="{ width: progress + '%' }"></view>
                        </view>
                    </view>
                </view>
                <view class="tip">{{ $t('poster.exitTip') }}</view>
            </view>
        </template>
    </IndexProup>
    <IndexProup :show="pipeiproup" @close="pipeiproup = false">
        <template #content>
            <view class="tishi">
                <view class="title">{{ $t('mbti.doubleMatch') }}</view>
                <view class="titles">{{ $t('mbti.inviteFriend') }}</view>
                <!-- 操作 -->
                <view class="opera">
                    <view class="myma"><input type="text" :placeholder="handleEncrypt()"
                            placeholder-style="color:#9A90FF;" :disabled="true"></view>
                    <view class="copy" @click="copy">{{ $t('mbti.clickCopy') }}</view>
                </view>
                <view class="titlescon">
                    <view v-for="(item, index) in pipeicontent" :key="index" class="titles">{{ index + 1 }}.{{ item }}
                    </view>
                </view>
            </view>

        </template>
    </IndexProup>
    <MbtiProup :show="mbtishow" @close="mbtishow = false" :moneyType="posterType"></MbtiProup>
</template>

<script>
import { getPosterList, deletePosters, reGeneratePoster, getUserInfo } from "@/api/login.js";
import { pageStayMixin } from "@/utils/pageStayMixin.js";
import IndexProup from '@/components/IndexProup/IndexProup.vue';
import { t } from '@/i18n/index.js';
import { aesEncrypt} from '@/utils/crypto.js';
import { getcode } from '@/api/mbti.js'
import MbtiProup from '@/components/MbtiProup/MbtiProup.vue';
export default {
    components: {
        IndexProup,
        MbtiProup
    },
    mixins: [pageStayMixin],
    data() {
        return {
            pageName: '',
            showDelPopup: false,
            showDelPopup2: false,
            selectedCount: 0,
            currentPosterId: null, // 当前点击的海报ID，用于重新生成
            currentCategory: 0,
            categoryScrollLeft: 0, // 分类滚动位置
            isType: true,
            showProgress: false, // 显示进度条弹窗
            progress: 0, // 进度百分比
            progressTimer: null, // 进度条定时器
            categoryList: [],
            posterList: [],
            currentPage: 1,
            pageSize: 10,
            hasMore: true,
            loading: false,
            isSelectAll: false, // 是否全选状态
            wasSelectAll: false, // 是否曾经全选过（用于判断反选）
            pipeiproup: false,
            pipeicontent: [],
            md5: '',
            poster_id: '',
            mbtishow:false,
            posterType:''
        };
    },
    onLoad() {
        // 设置导航栏标题
        // uni.setNavigationBarTitle({
        //     title: this.$t('poster.title') || '历史海报'
        // });

        // 初始化分类列表（使用 i18n）

        this.pageName = t('poster.title');

        // 检查登录状态，如果没有登录，posterList 保持为空数组
        const token = uni.getStorageSync("token");
        const userInfo = uni.getStorageSync("userInfo");
        if (!token || !userInfo) {
            this.posterList = [];
            this.hasMore = false;
            return;
        }

        this.fetchPosterList();
    },
    onPullDownRefresh() {
        // 下拉刷新
        const openId = uni.getStorageSync('openId')

        if (!openId) {
            uni.stopPullDownRefresh()
            return
        }

        getUserInfo(openId).then(res => {
            if (res.code === 200 || res.code === 201) {
                const userData = res.data?.data || res.data || {}
                uni.setStorageSync('userInfo', JSON.stringify(userData))
            }
            // 刷新海报列表
            this.fetchPosterList(true).finally(() => {
                // 延迟一下再停止刷新，让动画更流畅
                setTimeout(() => {
                    uni.hideLoading()
                    uni.stopPullDownRefresh()
                }, 500)
            })
        }).catch(err => {
            console.error('刷新用户信息失败:', err)
            // 即使获取用户信息失败，也刷新海报列表
            this.fetchPosterList(true).finally(() => {
                uni.stopPullDownRefresh()
            })
        })
    },
    onReachBottom() {
        // 页面触底事件（作为 scroll-view 的备选方案）
        console.log("========== 页面触底事件 ==========");
        this.loadMore();
    },
    onShow() {
        // if(!uni.getStorageSync('timestamp')){
        //     this.generateTimestampMD5()
        // }

        this.pipeicontent = [t('mbti.step1'), t('mbti.step2'), t('mbti.step3'), t('mbti.step4'),'试题类型将与邀请者保持一致']
        this.categoryList = [
            {
                label: t('poster.all'),
                icon: "/static/my/quanbu.png",
                color: "#9B59B6",
                type: "all",
            },
            // {
            //   label: t('poster.chatScreenshot'),
            //   icon: "/static/my/liaotian.png",
            //   color: "#FFB6E1",
            //   type: "chat",
            // },
            //   {
            //     label: t('poster.socialScreenshot'),
            //     icon: "/static/my/shejiao.png",
            //     color: "#5B9BD5",
            //     type: "social",
            //   },
            //   {
            //     label: t('poster.physicalPhoto'),
            //     icon: "/static/my/shiwu.png",
            //     color: "#66BB6A",
            //     type: "physical",
            //   },
            // {
            //   label: t('poster.consumeVoucher'),
            //   icon: "/static/my/xiaofei.png",
            //   color: "#F2C448",
            //   type: "consume",
            // },

            {
                label: t('poster.crushCheck'),
                icon: "/static/my/shiwu.png",
                color: "#66BB6A",
                type: "crushcheck",
            },
            {
                label: t('poster.answerBook'),
                icon: "/static/my/shejiao.png",
                color: "#5B9BD5",
                type: "answer",
            },
            {
                label: t('poster.tarotCard'),
                icon: "/static/my/shiwu.png",
                color: "#66BB6A",
                type: "tarot_card",
            },
            {
                label: t('poster.mbti'),
                icon: "/static/my/shiwu.png",
                color: "#66BB6A",
                type: "mbti",
            },
        ];
    },

    methods: {
        //复制邀请码
        copy() {
            uni.setClipboardData({
                data: this.handleEncrypt(),
                success: function () {
                    uni.showToast({
                        title: t('common.copySuccess'),
                        icon: 'none'
                    });
                }
            });

        },
        handleEncrypt() {
            const encryptedData = uni.getStorageSync('openId') + '@' + this.md5
            const end = aesEncrypt(encryptedData)
            return end
        },
        path() {
            uni.switchTab({ url: '/pages/index/index' })
        },
        // 刷新用户信息
        refreshUserInfo() {
            const openId = uni.getStorageSync('openId')

            if (!openId) {
                uni.stopPullDownRefresh()
                return
            }

            getUserInfo(openId).then(res => {
                if (res.code === 200 || res.code === 201) {
                    const userData = res.data?.data || res.data || {}
                    uni.setStorageSync('userInfo', JSON.stringify(userData))
                }
                // 刷新海报列表
                this.fetchPosterList(true).finally(() => {
                    // 延迟一下再停止刷新，让动画更流畅
                    setTimeout(() => {
                        uni.hideLoading()
                        uni.stopPullDownRefresh()
                    }, 500)
                })
            }).catch(err => {
                console.error('刷新用户信息失败:', err)
                // 即使获取用户信息失败，也刷新海报列表
                this.fetchPosterList(true).finally(() => {
                    uni.stopPullDownRefresh()
                })
            })
        },
        // 获取海报列表
        async fetchPosterList(reset = false) {
            if (this.loading) return Promise.resolve();

            // 检查登录状态
            const token = uni.getStorageSync("token");
            const userInfo = uni.getStorageSync("userInfo");

            // 如果没有登录，将 posterList 设置为空数组
            if (!token || !userInfo) {
                this.posterList = [];
                this.hasMore = false;
                this.loading = false;
                return Promise.resolve();
            }

            if (reset) {
                this.currentPage = 1;
                this.posterList = [];
                this.hasMore = true;
            }

            if (!this.hasMore && !reset) return Promise.resolve();

            this.loading = true;
            try {
                // 获取当前选中的分类类型
                const currentCategoryType =
                    this.categoryList[this.currentCategory]?.type || "all";
                const posterType =
                    currentCategoryType === "all" ? "" : currentCategoryType;

                // 获取用户ID
                const userId = JSON.parse(userInfo).id || "";

                const res = await getPosterList(
                    this.currentPage,
                    this.pageSize,
                    posterType,
                    userId
                );

                console.log("获取历史海报列表成功", res);

                if (res.code === 200 || res.code === 201) {
                    // 解析返回的数据结构
                    const data = res.data || {};
                    const results = data.results || [];
                    const pagination = data.pagination || {};

                    console.log("接口返回数据", {
                        resultsLength: results.length,
                        pagination: pagination,
                    });

                    // 为每个项目添加 isActive 属性
                    const formattedResults = results.map((item) => ({
                        ...item,
                        isActive: this.isSelectAll && !this.isType, // 如果全选状态且处于管理模式，新数据也选中
                    }));

                    if (reset) {
                        this.posterList = formattedResults;
                        // reset 时，currentPage 已经在前面设置为 1 了，这里不需要再设置
                    } else {
                        this.posterList = [...this.posterList, ...formattedResults];
                    }

                    if (!this.isType) {
                        // 如果处于管理模式
                        if (this.isSelectAll) {
                            // 如果全选状态，所有项都选中
                            this.posterList.forEach((item) => {
                                item.isActive = true;
                            });
                        } else {
                            // 否则所有项都不选中
                            this.posterList.forEach((item) => {
                                item.isActive = false;
                            });
                        }
                        this.updateSelectedCount();
                    }

                    // 根据 pagination 判断是否还有更多数据
                    const responsePage = pagination.page;
                    const totalPages = pagination.total_pages;

                    console.log("分页信息", {
                        reset: reset,
                        responsePage: responsePage,
                        thisCurrentPage: this.currentPage,
                        totalPages: totalPages,
                        resultsLength: results.length,
                        pageSize: this.pageSize,
                    });

                    // 判断是否还有更多数据的逻辑：
                    // 优先根据返回的数据数量判断，这是最可靠的判断方式
                    const currentPageFromResponse = reset
                        ? (responsePage !== undefined && responsePage !== null ? responsePage : 1)
                        : (responsePage !== undefined && responsePage !== null ? responsePage : this.currentPage);

                    if (results.length === 0) {
                        // 返回空数据，说明没有更多数据了
                        this.hasMore = false;
                        console.log("返回空数据，没有更多数据");
                    } else if (results.length < this.pageSize) {
                        // 返回的数据少于每页数量，说明没有更多数据了
                        this.hasMore = false;
                        console.log("返回数据少于每页数量，没有更多数据");
                    } else {
                        // 返回的数据等于每页数量，假设还有更多数据，继续加载
                        // 更新页码为下一页
                        this.currentPage = currentPageFromResponse + 1;
                        this.hasMore = true;
                        console.log("返回数据等于每页数量，假设还有更多数据，下一页:", this.currentPage);

                        // 如果有 totalPages 信息，也记录一下，但不作为主要判断依据
                        if (totalPages !== undefined && totalPages !== null && totalPages > 0) {
                            console.log("总页数信息:", totalPages, "当前页:", currentPageFromResponse);
                            // 如果当前页已经大于等于总页数，记录警告但不停止加载
                            // 因为可能接口返回的 totalPages 不准确
                            if (currentPageFromResponse >= totalPages) {
                                console.log("警告：当前页已大于等于总页数，但返回数据等于每页数量，继续尝试加载下一页");
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("获取历史海报列表失败:", error);
            } finally {
                this.loading = false;
            }
        },

        // 加载更多
        loadMore() {
            console.log("========== 触底加载更多 ==========");
            console.log("状态检查:", {
                loading: this.loading,
                hasMore: this.hasMore,
                currentPage: this.currentPage,
                posterListLength: this.posterList.length
            });

            if (!this.loading && this.hasMore) {
                console.log("开始加载更多数据，当前页码:", this.currentPage);
                this.fetchPosterList();
            } else {
                console.log("跳过加载:", {
                    loading: this.loading,
                    hasMore: this.hasMore
                });
            }
        },

        // 格式化日期为相对时间
        formatDate(dateString) {
            if (!dateString) return "";

            const now = new Date();
            const date = new Date(dateString);
            const diff = now - date; // 时间差（毫秒）

            // 小于 1 分钟：显示 "刚刚"
            const seconds = Math.floor(diff / 1000);
            if (seconds < 60) {
                return this.$t('poster.justNow');
            }

            // 1 分钟 - 59 分钟：显示 "X 分钟前"
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) {
                return `${this.$t('poster.minutesAgo')}${minutes}${this.$t('poster.minutesAgoUnit')}`;
            }

            // 1 小时 - 23 小时：显示 "X 小时前"
            const hours = Math.floor(minutes / 60);
            if (hours < 24) {
                return `${this.$t('poster.hoursAgo')}${hours}${this.$t('poster.hoursAgoUnit')}`;
            }

            // 1 天 - 29 天：显示 "X 天前"
            const days = Math.floor(hours / 24);
            if (days < 30) {
                return `${this.$t('poster.daysAgo')}${days}${this.$t('poster.daysAgoUnit')}`;
            }

            // 1 个月 - 11 个月：显示 "X 个月前"
            const months = Math.floor(days / 30);
            if (months < 12) {
                return `${this.$t('poster.monthsAgo')}${months}${this.$t('poster.monthsAgoUnit')}`;
            }

            // 1 年及以上：显示 "X 年前"
            const years = Math.floor(months / 12);
            return `${this.$t('poster.yearsAgo')}${years}${this.$t('poster.yearsAgoUnit')}`;
        },

        // 生成时间戳并进行MD5加密
        generateTimestampMD5() {
            getcode(this.poster_id).then(res => {
                this.pipeiproup = true
                this.md5 = res.data.unique_key
            })
        },
        // 获取状态文本
        getStatusText(status) {
            const statusMap = {
                waiting: this.$t('poster.generating'),
                done: this.$t('poster.done'),
                error: this.$t('common.fail'),
                deleted: this.$t('poster.deleted'),
            };
            return statusMap[status] || "";
        },
        // 获取状态标题文本（用于状态遮罩层）
        getStatusTitle(status) {
            if (status === "waiting") {
                return this.$t('poster.generatingStatus');
            } else if (status === "error") {
                return this.$t('poster.generatingFailed');
            }
            return "";
        },

        // 根据 template_type 获取对应的标签
        getPosterTypeLabel(templateType) {
            if (!templateType) return this.$t('poster.unknownType');
            const typeMap = {
                consume: this.$t('poster.consumeVoucher'),
                chat: this.$t('poster.chatScreenshot'),
                social: this.$t('poster.socialScreenshot'),
                physical: this.$t('poster.physicalPhoto'),
            };
            return typeMap[templateType] || this.$t('poster.unknownType');
        },

        // 根据 template_type 获取对应的颜色
        getCategoryColor(templateType) {
            if (!templateType) return "#666";
            const category = this.categoryList.find(
                (item) => item.type === templateType
            );
            return category?.color || "#666";
        },

        // 处理海报点击
        handlePosterClick(item, index, type) {
            if (type == 'mbti' && item.status == 'waiting') {
                if (item.mbti_list[0].templates[0].template_type == 'double') { //双人
                    if (item.mbti_list[0].other_status == 'exit' || item.mbti_list[0].other_status == '') {
                        this.poster_id = item.id
                        if (item.mbti_list[0].master) {
                            this.generateTimestampMD5()
                        }
                    }
                }
                return
            }
            // 如果状态是已完成，跳转到详情页
            if (item.status == "done") {
                console.log(item.status)
                if (item.id) {
                    if (type == 'social' || type == 'physical') {
                        uni.navigateTo({
                            url: `/pages/index/proProster?id=${item.id}`,
                            fail: (err) => {
                                console.error("跳转失败:", err);
                                uni.showToast({
                                    title: this.$t('poster.jumpFailed'),
                                    icon: "none",
                                });
                            },
                        });
                    } else if (type == 'answer') {
                        uni.navigateTo({
                            url: '/pages/index/answer-result_1213639316?id=' + item.id + '&details=' + true,
                            fail: (err) => {
                                console.error("跳转失败:", err);
                                uni.showToast({
                                    title: this.$t('poster.jumpFailed'),
                                    icon: "none",
                                });
                            },
                        });
                    } else if (type == 'tarot_card') {
                        uni.navigateTo({
                            url: '/pagesA/tarotcards/result?id=' + item.id,
                            fail: (err) => {
                                console.error("跳转失败:", err);
                                uni.showToast({
                                    title: this.$t('poster.jumpFailed'),
                                    icon: "none",
                                });
                            },
                        });
                    } else if (type == 'mbti') {
                        if (item.mbti_list[0].templates[0].template_type == 'double') { //双人
                            if (item.mbti_list[0].other_status == 'waiting') return
                            if (item.mbti_list[0].other_status == 'exit' || item.mbti_list[0].other_status == '') {
                                this.poster_id = item.id
                                this.generateTimestampMD5()
                            }
                            if (item.mbti_list[0].other_status == 'done') {
                                uni.navigateTo({
                                    url: '/pagesA/mbti/poster?id=' + item.id + '&type=' + item.mbti_list[0].templates[0].template_type,
                                    fail: (err) => {
                                        console.error("跳转失败:", err);
                                        uni.showToast({
                                            title: this.$t('poster.jumpFailed'),
                                            icon: "none",
                                        });
                                    },
                                });
                            }
                        } else {//单人
                            uni.navigateTo({
                                url: '/pagesA/mbti/poster?id=' + item.id + '&type=' + item.mbti_list[0].templates[0].template_type,
                                fail: (err) => {
                                    console.error("跳转失败:", err);
                                    uni.showToast({
                                        title: this.$t('poster.jumpFailed'),
                                        icon: "none",
                                    });
                                },
                            });
                        }


                    }

                } else {
                    uni.showToast({
                        title: this.$t('poster.posterIdNotExist'),
                        icon: "none",
                    });
                }
                return;
            }

            // 如果状态是生成失败，显示失败弹窗
            if (item.status === "error") {
                this.currentPosterId = item.id; // 保存当前海报ID
                this.showDelPopup2 = true;
                return;
            }

            // 其他状态，预览图片
            this.previewImage(item, index);
        },
        // 预览图片
        previewImage(item, index) {
            // 如果状态是生成中、失败或已删除，不允许预览
            if (
                item.status === "waiting" ||
                item.status === "error" ||
                item.status === "deleted" ||
                !item.file_url
            ) {
                return;
            }

            // 收集所有可预览的图片URL（已完成状态的图片）
            const urls = this.posterList
                .filter((poster) => poster.file_url && poster.status === "done")
                .map((poster) => poster.file_url);

            // 找到当前图片在列表中的索引
            const currentIndex = urls.findIndex((url) => url === item.file_url);

            uni.previewImage({
                urls: urls,
                current: currentIndex >= 0 ? currentIndex : 0,
                fail: (err) => {
                    console.error("预览图片失败:", err);
                    uni.showToast({
                        title: this.$t('poster.previewFailed'),
                        icon: "none",
                    });
                },
            });
        },
        // 获取微信登录code
        getWeixinCode() {
            // 微信小程序环境，直接使用 uni.login，不需要传 provider
            uni.login({
                success: (res) => {
                    console.log("登录成功，code:", res.code);
                    if (res.code) {
                        // 这里可以将 code 发送到服务器换取 openid 和 session_key
                        // this.sendCodeToServer(res.code);
                        uni.showToast({
                            title: this.$t('common.getCodeSuccess'),
                            icon: "success",
                        });
                    } else {
                        console.error("获取code失败:", res);
                        uni.showToast({
                            title: this.$t('common.getCodeFailed'),
                            icon: "none",
                        });
                    }
                },
                fail: (err) => {
                    console.error("登录失败:", err);
                    uni.showToast({
                        title: this.$t('common.loginFailed') + (err.errMsg ? ': ' + err.errMsg : ''),
                        icon: "none",
                    });
                },
            });
        },

        handleCategoryClick(item, index) {
            if (this.currentCategory === index) {
                return;
            }
            this.currentCategory = index;
            if (!this.isType) {
                this.exitManageMode();
            }

            // 滚动到中间位置
            this.$nextTick(() => {
                this.scrollCategoryToCenter(index);
            });

            // 根据选择的分类重新加载海报列表
            this.fetchPosterList(true);
        },

        // 滚动分类到中间位置
        scrollCategoryToCenter(index) {
            const query = uni.createSelectorQuery().in(this);

            // 同时获取所有需要的元素信息
            query.select(".category-scroll").boundingClientRect();
            query.select(`#category-${index}`).boundingClientRect();
            query.select(".category-track").boundingClientRect();

            query.exec((res) => {
                if (!res || res.length < 3) return;

                const scrollRect = res[0];
                const itemRect = res[1];
                const trackRect = res[2];

                if (!scrollRect || !itemRect || !trackRect) return;

                const scrollViewWidth = scrollRect.width;

                // 计算 tab 相对于 track 的位置
                const itemLeft = itemRect.left - trackRect.left;
                const itemWidth = itemRect.width;
                const itemCenter = itemLeft + itemWidth / 2;

                // 计算需要滚动的位置，使 tab 居中
                const scrollLeft = itemCenter - scrollViewWidth / 2;

                // 确保滚动位置不为负数
                this.categoryScrollLeft = Math.max(0, scrollLeft);
            });
        },

        toggleSelect(item) {
            item.isActive = !item.isActive;
            this.updateSelectedCount();
            // 如果手动取消选择，检查是否所有项都被选中，如果不是则取消全选状态
            const allSelected = this.posterList.every((p) => p.isActive);
            this.isSelectAll = allSelected;
            // 如果之前是全选状态，现在取消了一些，保持 wasSelectAll 为 true（用于反选判断）
            if (!allSelected && this.wasSelectAll) {
                // wasSelectAll 保持为 true，表示曾经全选过
            } else if (allSelected) {
                // 如果又全选了，重置 wasSelectAll
                this.wasSelectAll = false;
            }
        },
        updateSelectedCount() {
            this.selectedCount = this.posterList.filter((p) => p.isActive).length;
        },
        enterManageMode() {
            this.isType = false;
            this.isSelectAll = false; // 重置全选状态
            this.wasSelectAll = false; // 重置全选标志
            this.posterList.forEach((item) => {
                item.isActive = false;
            });
            this.selectedCount = 0;
        },
        selectAll() {
            // 切换全选/取消全选状态
            this.isSelectAll = !this.isSelectAll;
            this.posterList.forEach((item) => {
                item.isActive = this.isSelectAll;
            });
            this.updateSelectedCount();
            // 如果全选，标记为曾经全选过
            if (this.isSelectAll) {
                this.wasSelectAll = true;
            } else {
                // 如果取消全选，重置标志
                this.wasSelectAll = false;
            }
        },
        exitManageMode() {
            this.isType = true;
            this.isSelectAll = false; // 重置全选状态
            this.wasSelectAll = false; // 重置全选标志
            this.posterList.forEach((item) => {
                item.isActive = false;
            });
            this.selectedCount = 0;
            this.showDelPopup = false;
        },
        delItems() {
            this.updateSelectedCount();
            // 获取选中的海报列表
            const selectedList = this.posterList.filter((item) => item.isActive);

            if (selectedList.length === 0) {
                uni.showToast({
                    title: this.$t('poster.pleaseSelectPoster'),
                    icon: "none",
                });
                return;
            }

            // 显示删除确认弹窗
            this.showDelPopup = true;
        },

        // 确认删除
        async confirmDelete() {
            // 获取选中的海报列表
            const selectedList = this.posterList.filter((item) => item.isActive);
            // 获取未选中的海报列表
            const unselectedList = this.posterList.filter((item) => !item.isActive);

            if (selectedList.length === 0) {
                this.showDelPopup = false;
                return;
            }

            try {
                const currentCategoryType =
                    this.categoryList[this.currentCategory]?.type || "all";
                const posterType =
                    currentCategoryType === "all" ? "" : currentCategoryType;

                let params = {
                    ids: [],
                    poster_type: posterType,
                    select_type: '' // normal(默认)/all(全选)/invert(反选)
                };

                // 判断选择类型
                if (this.isSelectAll && selectedList.length === this.posterList.length) {
                    // 全选状态：所有项都选中
                    params.select_type = 'all';
                    params.ids = ''
                } else if (this.wasSelectAll && unselectedList.length > 0) {
                    // 先全选，再取消部分：传递未选中的ID数组（反选）
                    const unselectedIds = unselectedList.map((item) => item.id).filter((id) => id);
                    params.select_type = 'invert';
                    params.ids = unselectedIds.join(',')
                } else {
                    // 手动勾选：传递选中的ID数组
                    const selectedIds = selectedList.map((item) => item.id).filter((id) => id);
                    if (selectedIds.length === 0) {
                        uni.showToast({
                            title: this.$t('poster.cannotGetPosterId'),
                            icon: "none",
                        });
                        this.showDelPopup = false;
                        return;
                    }
                    params.select_type = 'normal';
                    params.ids = selectedIds.join(',')
                }

                // 调用删除接口
                const res = await deletePosters(params);
                console.log("删除海报成功", res);

                if (res.code === 200 || res.code === 201) {
                    // 删除成功后，从列表中移除选中的项
                    this.posterList = this.posterList.filter((item) => !item.isActive);

                    // 关闭弹窗
                    this.showDelPopup = false;

                    // 显示删除成功提示
                    uni.showToast({
                        title: `${this.$t('common.deletedPosters')}${selectedList.length}${this.$t('common.deletedPostersUnit')}`,
                        icon: "success",
                    });

                    // 重置全选标志
                    this.wasSelectAll = false;
                    this.exitManageMode();
                } else {
                    uni.showToast({
                        title: res.msg || res.message || this.$t('common.operationFailed'),
                        icon: "none",
                    });
                }
            } catch (error) {
                console.error("删除海报失败:", error);
                uni.showToast({
                    title: error.msg || error.message || this.$t('common.operationFailed'),
                    icon: "none",
                });
            }
        },
        handleFailCancel() {
            this.showDelPopup2 = false;
            this.currentPosterId = null; // 清空保存的海报ID
            if (!this.isType) {
                this.exitManageMode();
            }
        },
        // 点击重新生成按钮
        handleRetryClick(item) {
            if (!item.id) {
                uni.showToast({
                    title: this.$t('poster.posterIdNotExist'),
                    icon: "none",
                });
                return;
            }
            this.currentPosterId = item.id;
            this.handleRetryEdit();
        },
        async handleRetryEdit() {
            if (!this.currentPosterId) {
                uni.showToast({
                    title: this.$t('poster.posterIdNotExist'),
                    icon: "none",
                });
                this.showDelPopup2 = false;
                return;
            }

            // 关闭失败弹窗
            this.showDelPopup2 = false;

            // 显示进度条弹窗
            this.showProgress = true;
            this.progress = 0;
            // 清除之前的定时器
            if (this.progressTimer) {
                clearInterval(this.progressTimer);
                this.progressTimer = null;
            }

            // 启动进度条动画
            this.progressTimer = setInterval(() => {
                if (this.progress >= 99) {
                    clearInterval(this.progressTimer);
                    this.progressTimer = null;
                    return;
                }
                this.progress++;
            }, 20);

            try {
                // 调用重新生成海报接口，不显示loading（因为已经有进度条了）
                const res = await reGeneratePoster(this.currentPosterId, false);
                console.log("重新生成海报成功", res);

                // 清除进度条定时器
                if (this.progressTimer) {
                    clearInterval(this.progressTimer);
                    this.progressTimer = null;
                }

                if (res.code === 200 || res.code === 201) {
                    // 设置进度为100%
                    this.progress = 100;


                    // 延迟关闭弹窗，让用户看到100%
                    setTimeout(() => {
                        this.showProgress = false;
                        this.currentPosterId = null;
                        this.fetchPosterList(true);
                    }, 500);
                } else {
                    this.showProgress = false;
                    this.currentPosterId = null;
                }
            } catch (error) {
                console.error("重新生成海报失败:", error);

                // 清除进度条定时器
                if (this.progressTimer) {
                    clearInterval(this.progressTimer);
                    this.progressTimer = null;
                }


                // 关闭进度条弹窗
                this.showProgress = false;
                this.currentPosterId = null;


                uni.showToast({
                    title: error.msg || error.message || this.$t('common.operationFailed'),
                    icon: "none",
                });
            }
        },
        handleProgressClose() {
            this.fetchPosterList(true)
            if (this.progressTimer) {
                clearInterval(this.progressTimer);
                this.progressTimer = null;
            }
            this.showProgress = false;
            this.progress = 0;
        },
    },
};
</script>
<style scoped lang="scss">
.poster-page {

    min-height: 100vh;
    background: #12111f;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.no-empt {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 25vh;

    image {
        width: 200rpx;
    }

    .title {
        margin: 50rpx 0;
        font-size: 30rpx;
        color: rgba(255, 255, 255, 0.6);
    }

    .btn {
        width: 400rpx;
        height: 90rpx;
        margin: 40rpx auto;
        text-align: center;
        line-height: 90rpx;
        color: #ffffff;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.17);
        border-radius: 80rpx;
        margin-top: 50rpx;
    }
}

.top {
    display: flex;

    display: flex;
    justify-content: space-between;
    background: #1d182e;
    padding: 0 20rpx;
    padding-top: 20rpx;
}

.category-bar {
    margin-bottom: 20rpx;
    position: sticky;
    top: 0rpx;
    z-index: 5;
    padding: 32rpx 20rpx;
    background: #1d182e;
}

.category-scroll {
    width: 100%;
    white-space: nowrap;
}

.category-track {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.category-pill {
    padding: 18rpx 40rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.6);
    font-size: 28rpx;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;

    &.active {
        background: #2b2848;
        color: #ffffff;
    }
}

.poster-list-wrapper {
    flex: 1;
}

.poster-list-container {
    padding: 20rpx;
    padding-bottom: 100rpx;
}

.poster {
    background: rgba(255, 255, 255, 0.1);
    border: 0.5px solid #FFFFFF;
    display: flex;
    align-items: center;
    padding: 20rpx;
    border-radius: 20rpx;
    height: 290rpx;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 20rpx;

    .left {
        width: 30%;
        height: 250rpx;
        position: relative;
        border-radius: 12rpx;
        overflow: hidden;

        image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: filter 0.3s;

            &.poster-image--blur {
                filter: blur(8rpx);
            }
        }

        .poster-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.55);
            font-size: 24rpx;
            background: rgba(255, 255, 255, 0.05);
        }
    }

    .status-overlay {
        position: absolute;
        inset: 0;
        background: rgba(18, 17, 31, 0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 24rpx;
        backdrop-filter: blur(12rpx);
        z-index: 2;
        border-radius: 20rpx;
        overflow: hidden;

        .status-badge {
            position: absolute;
            top: 50rpx;
            right: 40rpx;
            width: 250rpx;
            padding: 16rpx 0;
            text-align: center;
            background: rgba(255, 255, 255, 0.37);
            transform: translate(40%, -20%) rotate(45deg);
            transform-origin: center;
            z-index: 3;
            text-align: center;
            overflow: hidden;
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);

            &--error {
                background: rgba(255, 77, 77, 0.85);
                cursor: pointer;
            }

            .status-badge-text {
                color: #000;
                font-size: 22rpx;
                font-weight: 500;
                transform: rotate(360deg);
                display: block;
                white-space: nowrap;
                line-height: 1.2;
            }
        }
    }

    .right {
        width: 70%;
        font-size: 36rpx !important;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .details {
            margin-top: 50rpx;
            font-weight: 500;
            font-size: 36rpx;
            line-height: 1.2;

            .look {
                position: absolute;
                right: 20rpx;
                bottom: 20rpx;
                font-weight: 100;
                font-size: 28rpx;
            }
        }

        .num {
            margin-top: 10rpx;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .select-icon {
        position: absolute;
        left: 20rpx;
        top: 20rpx;
        width: 60rpx;
        height: 60rpx;
        z-index: 3;
    }

    &.answer {
        .num {
            // font-weight: bold;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .left {
            width: 30%;
            height: 250rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            image {
                width: 70%;
                height: 80%;
                object-fit: contain;
            }
        }

        .details {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
        }
    }
}

.loading-more,
.no-more {
    width: 100%;
    text-align: center;
    padding: 36rpx 0;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.55);
}

.action-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24rpx 30rpx 24rpx;
    background: linear-gradient(0deg,
            rgba(18, 17, 31, 0.96),
            rgba(18, 17, 31, 0.6));
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24rpx;
    z-index: 9999;
}

.action-controls {
    display: flex;
    gap: 24rpx;
}

.action-btn {
    width: 420rpx;
    height: 88rpx;
    border-radius: 999rpx;
    border: none;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 48rpx;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid rgba(255, 255, 255, 0.17);

    &::after {
        border: none;
    }

    &.primary {
        background: linear-gradient(90deg, #9159e1 0%, #6a3ce1 100%);
        box-shadow: 0 16rpx 32rpx rgba(104, 66, 225, 0.35);
    }

    &.ghost {
        background: rgba(255, 255, 255, 0.14);
        color: rgba(255, 255, 255, 0.75);
    }

    &.danger {
        background: linear-gradient(90deg, #ff6bc5 0%, #b658ff 100%);
        box-shadow: 0 16rpx 32rpx rgba(190, 96, 255, 0.35);
    }
}

.del-popup-content {
    position: relative;
    width: 560rpx;
    padding: 160rpx 40rpx 48rpx;
    box-sizing: border-box;
    border-radius: 36rpx;
    background: linear-gradient(0deg, #ffffff 39%, #aea5fe 100%);
    box-shadow: 0px 0px 10.9px 0px rgba(148, 148, 148, 0.29);
    text-align: center;
}

.del-popup-icon {
    position: absolute;
    top: -90rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 200rpx;
    height: 200rpx;
}

.del-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 50rpx;
}

.del-popup-actions {
    display: flex;
    gap: 24rpx;
}

.del-popup-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 600;
}

.del-popup-btn.cancel {
    background: #eeedff;
    color: #b370ff;
}

.del-popup-btn.confirm {
    background: #b370ff;
    color: #ffffff;
}

.content {
    width: 420rpx;
    height: 250rpx;
    padding: 40rpx 0;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}



.progress-wrapper {
    width: 70%;
    margin: 10rpx auto;
    margin-bottom: 20rpx;
}

.custom-progress {
    width: 100%;
}

.progress-track {
    position: relative;
    width: 100%;
    height: 40rpx;
    background-color: #ffffff;
    border-radius: 40rpx;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #C084FC 0%, #9333EA 100%);
    background-image: repeating-linear-gradient(-45deg,
            #C084FC 0rpx,
            #D4A5F8 3rpx,
            #9333EA 7rpx,
            #9333EA 7rpx,
            #D4A5F8 10rpx,
            #C084FC 10rpx,
            #C084FC 10rpx,
            #D4A5F8 13rpx,
            #9333EA 17rpx,
            #9333EA 17rpx,
            #D4A5F8 20rpx,
            #C084FC 20rpx);
    border-radius: 40rpx;
    transition: width 0.3s ease;
    position: relative;
}

.tip {
    font-size: 20rpx;
    color: #a0a0a0;
    margin-top: 15rpx;
    width: 90%;
    text-align: center;
}

.tarot_card {
    width: 210rpx !important;
    height: 210rpx !important;
    margin-top: 20rpx;
}

.mbti1 {
    width: 150rpx !important;
    height: 180rpx !important;
    margin-right: 10rpx;
    margin-left: 20rpx !important;

}

.mbti {
    width: 150rpx !important;
    height: 150rpx !important;
    margin-left: 20rpx !important;
    margin-top: 60rpx;
}

.double {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .xi {
        display: flex;
        align-items: center;
        justify-content: space-between;
        align-items: center;
    }

    .wating {
        width: 170rpx;
        font-size: 24rpx;
        margin-top: 10rpx;
        margin-left: 20rpx;
    }
}

.tishi {
    width: 600rpx;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 45rpx;
    box-sizing: border-box;

    .opera {
        display: flex;
        flex-direction: column;
        align-items: center;

        .myma,
        .shuru {
            width: 410rpx;
            padding: 0 20rpx;
            height: 90rpx;
            line-height: 90rpx;
            text-align: center;
            border-radius: 90rpx;
            border: 1px solid #9A90FF;
            background: #F8F4FF;
            color: #9A90FF;
            margin-top: 40rpx;
            margin-bottom: 20rpx;

            input {
                width: 100%;
                height: 100%;
                line-height: 100%;
                color: #D5D1FF;
            }


        }

        .copy {
            color: rgba(61, 61, 61, 0.3);
            font-size: 26rpx;
            margin-bottom: 20rpx;
        }

        .and {
            font-size: 26rpx;
        }

        .shuru {
            margin-top: 20rpx;
        }
    }

    .layout {
        color: #B370FF;
        margin-top: 30rpx;
    }

    .titles {
        font-size: 26rpx;
        line-height: 45rpx;
        color: #3D3D3D;
    }

    .titlescon {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 10rpx;
    }

    .title {
        font-weight: bold;
        font-size: 36rpx;
        margin-bottom: 30rpx;
        text-align: center;
        width: 100%;
    }

    .agreement-content {
        width: 100%;
        max-height: 500rpx;
        margin-bottom: 20rpx;
        flex: 1;
        overflow-y: auto;
    }

    .richtext-content {
        width: 100%;
        font-size: 28rpx;
        line-height: 1.8;
        // color: rgba(0, 0, 0, 0.85);
        word-wrap: break-word;
    }

    .loading,
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40rpx 0;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.55);
    }

    .btn {
        background: #B370FF;
        color: #fff;
        margin-top: 20rpx;
        height: 100rpx;
        line-height: 100rpx;
        width: 100%;
        border-radius: 100rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
    }

    .disagree-btn {
        margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 28rpx;
    }
}

.tishi {
    width: 600rpx;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 45rpx;
    box-sizing: border-box;

    .opera {
        display: flex;
        flex-direction: column;
        align-items: center;

        .myma,
        .shuru {
            width: 410rpx;
            padding: 0 20rpx;
            height: 90rpx;
            line-height: 90rpx;
            text-align: center;
            border-radius: 90rpx;
            border: 1px solid #9A90FF;
            background: #F8F4FF;
            color: #9A90FF;
            margin-top: 40rpx;
            margin-bottom: 20rpx;

            input {
                width: 100%;
                height: 100%;
                line-height: 100%;
                color: #D5D1FF;
            }


        }

        .copy {
            color: rgba(61, 61, 61, 0.3);
            font-size: 26rpx;
            margin-bottom: 20rpx;
        }

        .and {
            font-size: 26rpx;
        }

        .shuru {
            margin-top: 20rpx;
        }
    }

    .layout {
        color: #B370FF;
        margin-top: 30rpx;
    }

    .titles {
        font-size: 26rpx;
        line-height: 45rpx;
        color: #3D3D3D;
    }

    .titlescon {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 10rpx;
    }

    .title {
        font-weight: bold;
        font-size: 36rpx;
        margin-bottom: 30rpx;
        text-align: center;
        width: 100%;
    }

    .agreement-content {
        width: 100%;
        max-height: 500rpx;
        margin-bottom: 20rpx;
        flex: 1;
        overflow-y: auto;
    }

    .richtext-content {
        width: 100%;
        font-size: 28rpx;
        line-height: 1.8;
        // color: rgba(0, 0, 0, 0.85);
        word-wrap: break-word;
    }

    .loading,
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40rpx 0;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 0.55);
    }

    .btn {
        background: #B370FF;
        color: #fff;
        margin-top: 20rpx;
        height: 100rpx;
        line-height: 100rpx;
        width: 100%;
        border-radius: 100rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 500;
    }

    .disagree-btn {
        margin-top: 20rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 28rpx;
    }
}
</style>
<style>
.u-safe-bottom {
    height: 0 !important;
}
</style>
