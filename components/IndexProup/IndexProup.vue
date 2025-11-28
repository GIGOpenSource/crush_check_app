<template>
	<view class="">
		<up-popup :show="show" mode="center" @close="handleClose" @open="show = true" :closeOnClickOverlay="closeOnClickOverlay">
			<view class="proup" :style="`height:${height}%`">
				<slot name="content"></slot>
				<view class="icon" @click="handleClose" v-if="cha" :class="{ 'icon-disabled': !canClose }"> <up-icon name="close-circle" color="#ffffff" size="30"></up-icon>
			</view>
			</view>
			
		</up-popup>

	</view>
</template>

<script setup>
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	cha: {
		type: Boolean,
		default: false
	},
	height:{
		type: Number,
		default: 100
	},
	closeOnClickOverlay: {
		type: Boolean,
		default: true
	},
	canClose: {
		type: Boolean,
		default: true
	}
})
const emits = defineEmits(["update:show", "close"])
const handleClose = () => {
	if (!props.canClose) {
		return;
	}
	emits("close");
	emits("update:show", false);
}
</script>

<style lang="scss" scoped>
.proup {
	width: 100%;
	// height: 125%;
	overflow: visible;
	border-radius: 20rpx;
	position: relative;
	overflow: hidden;
}

.icon {
	position: absolute;
	transform: translateX(-50%);
	left: 50%;
	bottom: -5rpx;
	color: #000;
	cursor: pointer;
	
	&.icon-disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}
</style>