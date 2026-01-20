<template>
	<view>
		<l-painter ref="painter" @success="handleSuccess" width="520rpx" height="1000rpx" isCanvasToTempFilePath>
			<!-- 背景渐变 -->
			<l-painter-view css="background: pink;">
			111
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
		// info: {
		// 	type: Object,
		// 	default: () => { }
		// }
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
	




}
</style>