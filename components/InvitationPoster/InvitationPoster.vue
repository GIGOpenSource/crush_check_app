<template>
	<view>
		<image :src="path" mode="widthFix" @load="success"></image>
		<l-painter ref="painter" @success="path = $event" hidden path-type="url" width="750rpx" height="100%" isCanvasToTempFilePath>
			<l-painter-view
				css="width: 100%; min-height: 400rpx;color: #fff;background: #2a2936;font-size: 26rpx;padding: 20rpx 20rpx;box-sizing: border-box;">
				<l-painter-view css="width: 100%;border-radius: 10rpx; padding: 20rpx 0; box-sizing: border-box;">
					<!-- 头部 -->
					<l-painter-view css="display: flex;align-items: center;">
						<l-painter-image v-if="userinfo.user_avatar" :src="userinfo.user_avatar"
							css="width: 100rpx; height: 100rpx; display: block;border-radius: 50%;margin-right: 20rpx;"></l-painter-image>
							<l-painter-image v-else :src="$getImg('my/user_no')"
							css="width: 100rpx; height: 100rpx; display: block;border-radius: 50%;margin-right: 20rpx;"></l-painter-image>
						<l-painter-view css="line-height: 50rpx;">
							<l-painter-text v-if="userinfo.username" :text='userinfo.username' css="display: block;"></l-painter-text>
							<l-painter-text v-else :text="t('no_nickname')" css="display: block;"></l-painter-text>
							<l-painter-text text='' css="display: block;">
								<l-painter-text :text="$t('tarot_input_question_title')"></l-painter-text>
								<l-painter-text :text='info.summary'></l-painter-text>
							</l-painter-text>
						</l-painter-view>
					</l-painter-view>
				<l-painter-view css="height:20rpx"></l-painter-view>
					<!-- 卡片1 -->
					<l-painter-view css="display: flex;align-items: center;justify-content: center;" v-if="info.tarot_cards_list.length == 1">
						<l-painter-view css="width: 200rpx;height: 240rpx;border: 1rpx solid #fff;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[0].name' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
					</l-painter-view>
					<!-- 卡片3 -->
					<l-painter-view css="display: flex;align-items: center;justify-content: center;" v-if="info.tarot_cards_list.length == 3">
						<l-painter-view css="width: 200rpx;height: 240rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[0].name' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
						<l-painter-view css="width: 200rpx;height: 240rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[1].name' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
						<l-painter-view css="width: 200rpx;height: 240rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;">
							<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text :text='info.tarot_cards_list[2].name' css="display: block;text-align: center;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
						</l-painter-view>
					</l-painter-view>
					<!-- 卡片5 -->
					<l-painter-view
						css="display: flex;align-items: center;justify-content: center;flex-direction: column;" v-if="info.tarot_cards_list.length == 5">
						<l-painter-view css="display: flex;align-items: center;justify-content: center;">
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-bottom: 0;">
								<l-painter-text text='3' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[2].name' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[2].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">

							</l-painter-view>
						</l-painter-view>
						<l-painter-view css="display: flex;align-items: center;justify-content: center;">
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
								<l-painter-text text='1' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[0].name' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[0].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-right: 0;">
								<l-painter-text text='4' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[3].name' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[3].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[3].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;">
								<l-painter-text text='2' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[1].name' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[1].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
						</l-painter-view>
						<l-painter-view css="display: flex;align-items: center;justify-content: center;">
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;border: 1rpx solid #fff;border-top: 0;">
								<l-painter-text text='5' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text :text='info.tarot_cards_list[4].name' css="display: block;text-align: center;"></l-painter-text>
								<l-painter-text v-if="info.tarot_cards_list[4].is_reversed == 0"  :text="$t('tarot_result_tab_explain')" css="display: block;text-align: center;color: #00AEFF;"></l-painter-text>
							<l-painter-text v-if="info.tarot_cards_list[4].is_reversed == 1"  :text="$t('tarot_result_tab_interpret')" css="display: block;text-align: center;color: #FF0000;"></l-painter-text>
							</l-painter-view>
							<l-painter-view
								css="width: 150rpx;height: 140rpx;display: flex;flex-direction: column;align-items: center;justify-content: space-around;">

							</l-painter-view>
						</l-painter-view>
					</l-painter-view>
						<!-- 解读 -->
					<l-painter-view v-if="info.child_list.length == 1">
						<l-painter-view>
							<l-painter-text :text="$t('tarot_result_ai_interpret')" css="display: block;"></l-painter-text>
						</l-painter-view>
						<l-painter-view
							css="border: 1rpx solid #fff;border-radius: 10rpx;padding: 20rpx;margin: 20rpx 0;background: #3f3e4a;">
							<l-painter-text :text='info.child_list[0]?.content.summary' css="display: block;"></l-painter-text>
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
			img: '',//二维码图片
			userinfo:JSON.parse(uni.getStorageSync('userInfo')),
			path:''
		};
	},
	created() {
		this.getlist()
	},
	methods: {
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