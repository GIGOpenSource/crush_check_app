<template>
	<view>
		<image :src="path" mode="widthFix" @load="success"></image>
		<l-painter ref="painter" @success="handleSuccess" @fail="handleFail" hidden path-type="url" width="600rpx" height="100%"
			:canvas-id="canvasId" isCanvasToTempFilePath file-type="jpg" :quality="1" :pixel-ratio="1">
			<l-painter-view
				css="width: 100%; min-height: 400rpx;color: #fff;background: #2a2936;font-size: 26rpx;padding: 20rpx 20rpx;box-sizing: border-box;">
				<l-painter-view css="width: 100%;border-radius: 10rpx; padding: 20rpx 0; box-sizing: border-box;">
					<!-- 头部 -->
					<l-painter-view css="display: flex;">
						<l-painter-image v-if="userinfo.user_avatar" :src="userinfo.user_avatar"
							css="width: 100rpx; height: 100rpx; display: block;border-radius: 50%;margin-right: 20rpx;"></l-painter-image>
						<l-painter-image v-else :src="$getImg('my/user_no')"
							css="width: 100rpx; height: 100rpx; display: block;border-radius: 50%;margin-right: 20rpx;margin-top: 20rpx;"></l-painter-image>
						<l-painter-view css="line-height: 50rpx;">
							<l-painter-text v-if="userinfo.username" :text='userinfo.username'
								css="display: block;"></l-painter-text>
							<l-painter-text v-else :text="$t('no_nickname')" css="display: block;"></l-painter-text>
							<l-painter-text text='' css="display: block;">
								<!-- <l-painter-text :text=""></l-painter-text> -->
								<l-painter-text :text="$t('tarot_result_question_label') + info.summary" css="display: block;max-width: 410rpx;word-wrap: break-word; word-break: break-all; white-space: normal;"></l-painter-text>
							</l-painter-text>
						</l-painter-view>
					</l-painter-view>
					<l-painter-view css="height:20rpx"></l-painter-view>
					<!-- 卡片1 -->
					<l-painter-view css="display: flex;align-items: center;justify-content: center;"
						v-if="info.tarot_cards_list.length == 1">
						<l-painter-view
							css="width: 200rpx;height: 240rpx;border: 1rpx solid #fff;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[0].name'
								css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 0"
								:text="$t('tarot_card_upright')"
								css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 1"
								:text="$t('tarot_card_reversed')"
								css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
					</l-painter-view>
					<!-- 卡片3 -->
					<l-painter-view css="display: flex;align-items: center;justify-content: center;"
						v-if="info.tarot_cards_list.length == 3">
						<l-painter-view
							css="width: 200rpx;height: 240rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[0].name'
								css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 0"
								:text="$t('tarot_card_upright')"
								css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 1"
								:text="$t('tarot_card_reversed')"
								css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
						<l-painter-view
							css="width: 200rpx;height: 240rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[1].name'
								css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 0"
								:text="$t('tarot_card_upright')"
								css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 1"
								:text="$t('tarot_card_reversed')"
								css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
						<l-painter-view
							css="width: 200rpx;height: 240rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[2].name'
								css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 0"
								:text="$t('tarot_card_upright')"
								css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 1"
								:text="$t('tarot_card_reversed')"
								css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
					</l-painter-view>
					<!-- 卡片5 -->
					<l-painter-view
						css="display: flex;align-items: center;justify-content: center;flex-direction: column;"
						v-if="info.tarot_cards_list.length == 5">
						<l-painter-view css="display: flex;align-items: center;justify-content: center;">
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-bottom: 0;">
								<l-painter-text text='3' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[2].name'
									css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 0"
									:text="$t('tarot_card_upright')"
									css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 1"
									:text="$t('tarot_card_reversed')"
									css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">

							</l-painter-view>
						</l-painter-view>
						<l-painter-view css="display: flex;align-items: center;justify-content: center;">
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
								<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[0].name'
									css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 0"
									:text="$t('tarot_card_upright')"
									css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 1"
									:text="$t('tarot_card_reversed')"
									css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
								<l-painter-text text='4' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[3].name'
									css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[3].is_reversed == 0"
									:text="$t('tarot_card_upright')"
									css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[3].is_reversed == 1"
									:text="$t('tarot_card_reversed')"
									css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;">
								<l-painter-text text='2' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[1].name'
									css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 0"
									:text="$t('tarot_card_upright')"
									css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 1"
									:text="$t('tarot_card_reversed')"
									css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
						</l-painter-view>
						<l-painter-view css="display: flex;align-items: center;justify-content: center;">
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-top: 0;">
								<l-painter-text text='5' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[4].name'
									css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[4].is_reversed == 0"
									:text="$t('tarot_card_upright')"
									css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[4].is_reversed == 1"
									:text="$t('tarot_card_reversed')"
									css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">

							</l-painter-view>
						</l-painter-view>
					</l-painter-view>
					<!-- 解读 -->
					<l-painter-view v-if="info.child_list.length == 1">
						<l-painter-view>
							<l-painter-text :text="$t('tarot_result_ai_interpret')"
								css="display: block;"></l-painter-text>
						</l-painter-view>
						<l-painter-view
							css="border: 1rpx solid #fff;border-radius: 10rpx;padding: 20rpx;margin: 20rpx 0;background: #3f3e4a;">
							<l-painter-text :text='info.child_list[0]?.content.summary'
								css="display: block;"></l-painter-text>
						</l-painter-view>
					</l-painter-view>



					<!-- 底部 -->
					<l-painter-view
						css="display: flex;align-items: center;justify-content: space-between;margin-top: 20rpx;">
						<l-painter-view css="width: 300rpx;">
							<l-painter-image :src="$getImg('my/logo')"
								css="width: 120rpx; height: 80rpx;margin-bottom: 20rpx;"></l-painter-image>
							<l-painter-view>
								<l-painter-text text='CrushCheck' css="display: block;"></l-painter-text>
							</l-painter-view>
						</l-painter-view>
						<l-painter-view>
							<l-painter-image :src="img"
								css="width: 180rpx; height: 180rpx; display: block;"></l-painter-image>
						</l-painter-view>
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
import { getQroter } from "@/api/tarotcards.js";
import { t } from '@/i18n/index.js';
export default {
	name: "invitationPoster",
	props: {
		info: {
			type: Object,
			// 优化1：给默认值初始化child_list，避免访问时报错
			default: () => ({
				child_list: []
			})
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
			img: '',//二维码图片
			userinfo: JSON.parse(uni.getStorageSync('userInfo')),
			path: '',
			canvasId: `invitation-poster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // 唯一的canvasId
		};
	},
	created() {
		this.getlist()
	},
	mounted() {
		this.processSummaryContent();
		// 在生成海报前清理小程序缓存
		this.clearTempFiles();
	},
	beforeDestroy() {
		// 组件销毁前清理canvas资源
		this.cleanupCanvas();
	},
	methods: {
		// 清理临时文件（支持小程序和APP）
		clearTempFiles() {
			try {
				// #ifdef MP-WEIXIN
				// 清理小程序文件系统中的临时文件
				const fs = uni.getFileSystemManager()
				if (fs) {
					try {
						// 获取用户数据路径（使用新的 API）
						let userDataPath = ''
						if (wx && wx.getWindowInfo) {
							userDataPath = wx.getWindowInfo().pixelRatio ? wx.env.USER_DATA_PATH : ''
						}
						if (!userDataPath && wx && wx.env) {
							userDataPath = wx.env.USER_DATA_PATH
						}
						if (!userDataPath) {
							// 降级方案
							const systemInfo = uni.getSystemInfoSync()
							userDataPath = systemInfo.USER_DATA_PATH || ''
						}
						
						if (userDataPath) {
							// 尝试读取目录并清理旧文件
							fs.readdir({
								dirPath: userDataPath,
								success: (res) => {
									// 清理所有图片文件（jpg, png等），最多清理10个
									const imageExts = ['.jpg', '.jpeg', '.png', '.gif']
									const imageFiles = res.files
										.filter(file => {
											const ext = file.substring(file.lastIndexOf('.'))
											return imageExts.includes(ext.toLowerCase())
										})
										.sort()
										.slice(0, 10) // 最多清理10个旧文件
									
									imageFiles.forEach(file => {
										fs.unlink({
											filePath: `${userDataPath}/${file}`,
											success: () => {
												console.log('已清理临时文件:', file)
											},
											fail: () => {
												// 忽略删除失败
											}
										})
									})
								},
								fail: () => {
									// 目录不存在或无法读取，忽略
								}
							})
						}
					} catch (e) {
						console.log('清理临时文件异常:', e)
					}
				}
				// #endif
				
				// #ifdef APP-PLUS
				// 清理APP临时文件目录
				try {
					const tempDirPath = '_doc/uniapp_temp'
					// 使用 plus.io 读取目录
					plus.io.resolveLocalFileSystemURL(tempDirPath, (dirEntry) => {
						// 检查是否是目录
						if (dirEntry.isDirectory) {
							const reader = dirEntry.createReader()
							reader.readEntries((entries) => {
								// 过滤图片文件并按时间排序
								const imageFiles = entries
									.filter(entry => {
										const name = entry.name || ''
										return /\.(jpg|jpeg|png|gif)$/i.test(name)
									})
									.sort((a, b) => {
										// 按修改时间排序，旧的在前
										const aTime = a.lastModifiedDate || 0
										const bTime = b.lastModifiedDate || 0
										return aTime - bTime
									})
									.slice(0, 10) // 最多清理10个旧文件
								
								imageFiles.forEach(fileEntry => {
									fileEntry.remove(() => {
										console.log('已清理APP临时文件:', fileEntry.name)
									}, (err) => {
										// 忽略删除失败
										console.log('删除文件失败:', err)
									})
								})
							}, (err) => {
								// 读取目录失败，忽略
								console.log('读取目录失败:', err)
							})
						}
					}, (err) => {
						// 解析路径失败，尝试使用文件系统管理器
						try {
							const fs = uni.getFileSystemManager()
							if (fs) {
								fs.readdir({
									dirPath: tempDirPath,
									success: (res) => {
										const imageFiles = res.files
											.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
											.sort()
											.slice(0, 10)
										
										imageFiles.forEach(file => {
											fs.unlink({
												filePath: `${tempDirPath}/${file}`,
												success: () => {
													console.log('已清理APP临时文件:', file)
												},
												fail: () => {}
											})
										})
									},
									fail: () => {}
								})
							}
						} catch (e) {
							console.log('清理APP临时文件异常:', e)
						}
					})
				} catch (e) {
					console.log('清理APP临时文件失败:', e)
				}
				// #endif
			} catch (e) {
				console.log('清理临时文件失败:', e)
			}
		},
		// 清理canvas资源
		cleanupCanvas() {
			try {
				const painter = this.$refs.painter
				if (painter) {
					// 清理canvas上下文
					if (painter.canvas) {
						try {
							const ctx = painter.canvas.getContext('2d')
							if (ctx) {
								ctx.clearRect(0, 0, painter.canvas.width || 0, painter.canvas.height || 0)
							}
						} catch (e) {
							console.log('清理canvas 2d上下文异常:', e)
						}
					}
					// 清理旧的canvas上下文（非2d）
					if (painter.ctx && painter.ctx.clearRect) {
						try {
							painter.ctx.clearRect(0, 0, painter.canvasWidth || 0, painter.canvasHeight || 0)
						} catch (e) {
							console.log('清理canvas上下文异常:', e)
						}
					}
					// 重置状态
					if (painter.done !== undefined) {
						painter.done = false
					}
					if (painter.inited !== undefined) {
						painter.inited = false
					}
					// 清理定时器
					if (painter.rendertimer) {
						clearTimeout(painter.rendertimer)
						painter.rendertimer = null
					}
				}
			} catch (e) {
				console.log('清理canvas资源异常:', e)
			}
		},
		// 处理生成成功
		handleSuccess(filePath) {
			this.path = filePath
			this.$emit('success', filePath)
			// 延迟清理，确保图片已加载和显示
			setTimeout(() => {
				this.cleanupCanvas()
			}, 2000)
		},
		// 处理生成失败
		handleFail(error) {
			console.error('海报生成失败:', error)
			this.cleanupCanvas()
			
			// 检查是否是存储空间不足的错误
			let errorMsg = ''
			if (error && error.errMsg) {
				if (error.errMsg.includes('maximum size') || error.errMsg.includes('storage limit')) {
					errorMsg = t('poster.storageLimitExceeded') || '存储空间不足，请清理缓存后重试'
				} else {
					errorMsg = error.errMsg
				}
			} else if (typeof error === 'string') {
				try {
					const errorObj = JSON.parse(error)
					if (errorObj.errMsg && (errorObj.errMsg.includes('maximum size') || errorObj.errMsg.includes('storage limit'))) {
						errorMsg = t('poster.storageLimitExceeded') || '存储空间不足，请清理缓存后重试'
					} else {
						errorMsg = errorObj.errMsg || error
					}
				} catch (e) {
					errorMsg = error
				}
			} else {
				errorMsg = t('poster.generateFailed') || '海报生成失败，请重试'
			}
			
			uni.showToast({
				title: errorMsg,
				icon: 'none',
				duration: 3000
			})
			
			this.$emit('fail', error)
		},
		processSummaryContent() {
			if (!this.info || !Array.isArray(this.info.child_list) || this.info.child_list.length === 0) {
				return;
			}
			const firstChild = { ...this.info.child_list[0] };
			if (firstChild.content && firstChild.content.summary) {
				firstChild.content.summary = firstChild.content.summary
					.replace(/<br\s*\/?>/gi, '\n')
					.trim()
					.replace(/\n+/g, '\n');
				this.info.child_list[0].content.summary = firstChild.content.summary;
			}
		},
		// 预览图片
		look() {
			uni.previewImage({
				urls: [this.path]
			})
		},
		success() {
			this.$emit('success', this.path)
		},
		getlist() {
			getQroter()
				.then(res => {
					this.img = res.data.qrcode_base64
				})
		}

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