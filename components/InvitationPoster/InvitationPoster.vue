<template>
	<view>
		<l-painter ref="painter" @success="handleSuccess" width="520rpx" height="1000rpx" isCanvasToTempFilePath>
			<!-- 背景渐变 -->
			<l-painter-view css="width: 520rpx; height: 1000rpx; position: relative;">
				<!-- 浅蓝色卡片背景 -->
				<l-painter-view
					css="width: 520rpx; height: 900rpx; position: absolute; left: 0rpx; top: 0rpx; border-radius: 15rpx; background: #ffffff; overflow: visible;">
					<!-- 白色内容区域 -->
					<l-painter-view
						css="width:500rpx; height: 900rpx; position: absolute; left: 0rpx; top: 0rpx; border-radius: 10rpx;background: #ffffff; overflow: visible;">
						<!-- 顶部数字图标 -->
						<l-painter-view 
							css="position: absolute; top: 30rpx; left:0; z-index: 9999; width:520rpx; height: 82rpx;background:#ffcef3;">
							<l-painter-image :src="posterIcon" css="width: 120rpx; height: 120rpx; object-fit: contain;margin-left: 160rpx;"></l-painter-image>
						</l-painter-view>
						<!-- 顶部蓝色横幅 -->
						<l-painter-view
							css="background:#bcefff; width: 500rpx; height: 80rpx; border-radius: 10rpx 10rpx 0 0; text-align: center; padding-top: 30rpx; position: absolute; left: 0; top: 100rpx; z-index: 1;padding-right: 100rpx;">
							<l-painter-text text="感情测试挑战"
								css="font-size: 24rpx; color: #333333; font-weight: bold;line-height: 80rpx;"></l-painter-text>
						</l-painter-view>

						<!-- 主要内容区域 -->
						<l-painter-view
							css="width: 500rpx; padding: 10rpx 20rpx; margin-top: 190rpx; display: flex; box-sizing: border-box; position: relative;">
							<!-- 左侧角色区域 -->
							<l-painter-view
								css="width: 220rpx; height: 380rpx;border-radius: 10rpx; margin-right: 20rpx; display: inline-block;">
								<l-painter-image :src="$getImg('index/people')"
									css="width: 220rpx; height: 380rpx; object-fit: contain; border-radius: 10rpx;"></l-painter-image>
							</l-painter-view>

							<!-- 右侧特质列表 -->
							<l-painter-view
								css="width: 280rpx; display: inline-block; vertical-align: top; margin-top: 50rpx;margin-left: 30rpx;">
								<l-painter-view v-for="(item, index) in traitList" :key="index"
									css="margin-bottom: 5rpx; display: flex; align-items: center; flex-wrap: nowrap;">
									<!-- 圆形图标 -->
									<l-painter-image :src="`/static/index/dui${index + 1}.png`"
										css="width: 30rpx; height: 30rpx; display: inline-block; margin-right: 15rpx; flex-shrink: 0;"></l-painter-image>
									<l-painter-view css="display: flex; flex-direction: column;">
										<!-- 特质文字 -->
										<l-painter-text :text="item.name"
											css="font-size: 20rpx; color: #333333; display: block; margin-bottom: 0rpx; white-space: nowrap;display:block;width: 180rpx;"></l-painter-text>
										<!-- 进度条图片 -->
										<l-painter-image :src="`/static/index/p${index + 1}.png`"
											css="width: 130rpx; height: 40rpx; display: block; object-fit: contain; flex-shrink: 0;"></l-painter-image>
									</l-painter-view>

								</l-painter-view>
							</l-painter-view>
						</l-painter-view>
					</l-painter-view>
				</l-painter-view>

				<!-- 底部信息区域（带边框） -->
				<l-painter-view
					css="width: 457rpx; position: absolute; top: 600rpx; left: 20rpx; border: 1rpx solid #000000; border-radius: 10rpx; padding: 20rpx 0; box-sizing: border-box;">
					<!-- 免责声明 -->
					<l-painter-text text='"本海报由AI生成,所有风险指数、性格分析仅为趣味参考"'
						css="font-size: 16rpx; color: #666666; text-align: center; width: 100%; line-height: 20rpx; margin-bottom: 20rpx; display: block;"></l-painter-text>

					<!-- 分隔线 -->
					<l-painter-view
						css="width: 100%; height: 2rpx; background:#000; margin-bottom: 20rpx;"></l-painter-view>

					<!-- 分数 -->
					<l-painter-view css="margin-bottom: 10rpx;display: flex;align-items: center;margin-left: 20rpx;">
						<l-painter-text text="可信赖分数值 : "
							css="font-size: 20rpx; color: #333333; display: inline;"></l-painter-text>
						<l-painter-text text="50分"
							css="font-size: 28rpx; color: #ff0000;display: inline;margin-left: 5rpx;"></l-painter-text>
					</l-painter-view>

					<!-- 星级 -->
					<l-painter-view css="margin-bottom: 10rpx;margin-left: 20rpx;display: flex;align-items: center;">
						<l-painter-text text="星级 : "
							css="font-size: 24rpx; color: #333333; display: inline;"></l-painter-text>
						<l-painter-text v-for="n in 5" :key="n" :text="'★'"
							css="font-size: 32rpx; color: #FFD700; margin-right: 5rpx; display: inline;"></l-painter-text>
					</l-painter-view>

					<!-- 分析文字 -->
					<l-painter-text text='"TA可能是一个提供情绪价值 但拒绝负责的暧昧体验家"'
						css="font-size: 22rpx; color: #333333; text-align: left; margin-bottom: 20rpx; line-height: 40rpx; display: block;margin-left: 15rpx;width:300rpx;font-weight: bold;text-align: center;"></l-painter-text>

					<!-- 二维码（右下角） -->
					<l-painter-view
						css="position: absolute; right: 20rpx; bottom: 20rpx; width: 80rpx; height: 80rpx;top:190rpx">
						<l-painter-image :src="$getImg('index/qrote')"
							css="width: 80rpx; height: 80rpx; object-fit: contain; border-radius: 5rpx;"></l-painter-image>
					</l-painter-view>
				</l-painter-view>
			</l-painter-view>
		</l-painter>
	</view>
</template>

<script>
// 海报插件地址:https://ext.dcloud.net.cn/plugin?id=2389
import lPainter from 'lime-painter/components/l-painter/l-painter.vue'
import lPainterImage from 'lime-painter/components/l-painter-image/l-painter-image.vue'
import lPainterQrcode from 'lime-painter/components/l-painter-qrcode/l-painter-qrcode.vue'
import lPainterText from 'lime-painter/components/l-painter-text/l-painter-text.vue'
import lPainterView from 'lime-painter/components/l-painter-view/l-painter-view.vue'
export default {
	name: "invitationPoster",
	props: {
		info: {
			type: Object,
			default: () => { }
		}
	},
	components: {
		lPainter,
		lPainterImage,
		lPainterQrcode,
		lPainterText,
		lPainterView
	},
	data() {
		return {
			show: true,
			img: '',
			code: '',
			previewImage: '',
			path: '',
			posterIcon: '/static/index/postericon.png',
			traitList: [
				{ name: '成本管控大师', color: '#87CEEB', progress: 85 },
				{ name: '氛围感高手', color: '#90EE90', progress: 75 },
				{ name: '热情体验官', color: '#FFA500', progress: 55 },
				{ name: '薛定谔的单身', color: '#87CEEB', progress: 35 }
			],
			stars: [true, true, true, false, false]
		};
	},
	created() {
	},
	methods: {
		// 预览图片
		look() {
			uni.previewImage({
				urls: [this.path]
			})
		},
		handleSuccess(path) {
			this.path = path
			this.$emit('success', this.path)
		},
		success() {
			this.$emit('success', this.path)
		},
	}

}
</script>

<style lang="scss">
.name {
	justify-content: space-between;
	box-sizing: border-box;
	border-radius: 8rpx;




}
</style>