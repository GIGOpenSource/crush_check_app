<template>
    <view>
        <image :src="path" mode="widthFix" @load="success"></image>
        <l-painter ref="painter" @success="handleSuccess" @fail="handleFail" hidden path-type="url" width="750rpx" height="100%"
            :canvas-id="canvasId" isCanvasToTempFilePath>
            <l-painter-view
                css="width: 100%; height: 100%;color: #000;background: #ffffff;font-size: 26rpx;padding: 20rpx 20rpx;box-sizing: border-box;">
                <l-painter-view css="width: 100%;border-radius: 10rpx; padding: 20rpx 0; box-sizing: border-box;">
                    <!-- 类型 -->
                    <l-painter-view css="display: flex;justify-content: space-between;">
                        <l-painter-view
                            css="display: flex;flex-direction: column;width:50%">
                            <l-painter-text text='你的人格类型为：'
                                css="display: block;font-size: 32rpx;"></l-painter-text>
                            <l-painter-text text='INTJ-A'
                                css="display: block;font-size:42rpx;color:#955EB1;margin-top:10rpx">
                            </l-painter-text>

                        </l-painter-view>
                        <l-painter-view
                            css="margin-left: auto;display: flex;flex-direction: column;width:50%;justify-content: flex-end;align-items:end;">
                            <l-painter-text text='你的人格类型为：'
                                css="display: block;font-size: 32rpx;width:100%; text-align: right;"></l-painter-text>
                            <l-painter-text text='INTJ-A'
                                css="display: block;font-size: 42rpx;color:#35A374;margin-top:10rpx;width:100%; text-align: right;">
                            </l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <!-- 图像 -->
                    <l-painter-view css="margin: 30rpx 80rpx;">
                        <l-painter-view
                            css=" display: flex;align-items: center;justify-content: center;flex-direction:column;">
                            <l-painter-view css="display: flex;font-size: 36rpx;align-items: center;">
                                <l-painter-text text='彩虹组'
                                    css="display: block;color:#35A374;font-weight:bolder;font-size:50rpx">
                                </l-painter-text>
                                <l-painter-image src="/static/index/bg.png"
                                    css="width: 100rpx; height: 100rpx; display: block;margin-left: 15rpx;"></l-painter-image>
                            </l-painter-view>
                            <l-painter-view
                                css="display: block;font-size: 24rpx; display: flex;align-items: center;flex-direction: column;justify-content: center">
                                <l-painter-text text='98%' css="display: block;font-size:28rpx;margin:20rpx 0">
                                </l-painter-text>
                                <l-painter-text text='琴瑟和鸣，羡煞旁人' css="display: block;color:#3D3D3D"> </l-painter-text>
                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <!-- 百分比 -->
                    <l-painter-view
                        css=" display: flex;align-items: center;justify-content: space-between;background: #F1F6F9;padding:30rpx;width:100%;box-sizing: border-box;border-radius: 15rpx;margin-bottom:20rpx"
                        v-for="(item, index) in list" :key="index">
                        <l-painter-view css="line-height:50rpx">
                            <l-painter-text :text='item.t1' css="display: block;"> </l-painter-text>
                            <l-painter-text :text='item.t2' css="display: block;color:#3D3D3D;font-size:24rpx">
                            </l-painter-text>
                        </l-painter-view>
                        <l-painter-view>
                            <l-painter-text text='90%' css="display: block;font-size:38rpx"> </l-painter-text>
                        </l-painter-view>
                    </l-painter-view>
                    <!-- 分析 -->
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='爱情关系深度分析' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text text='hahahahaahhahahahhahahahahahahahhahhhhhhhhhhhhhh'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='朋友伙伴关系匹配度分析' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text text='hahahahaahhahahahhahahahahahahahhahhhhhhhhhhhhhh'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='家庭亲属关系匹配度分析' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text text='hahahahaahhahahahhahahahahahahahhahhhhhhhhhhhhhh'
                                css=""></l-painter-text>
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
    name: "Twombtiposter",
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
            path: '',
            canvasId: `mbti-poster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 唯一的canvasId
            list: [{
                t1: '爱情关系匹配',
                t2: '恋爱伴侣关系匹配度分析'
            }, {
                t1: '友情关系匹配',
                t2: '朋友伙伴关系匹配度分析'
            }, {
                t1: '亲情关系匹配分析',
                t2: '家庭亲属关系匹配度分析'
            }]
        };
    },
    created() {

    },
    mounted() {
    },
    beforeDestroy() {
        // 组件销毁前清理canvas资源
        this.cleanupCanvas()
    },
    methods: {
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
        },
        // 预览图片
        look() {
            uni.previewImage({
                urls: [this.path]
            })
        },
        success() {
            this.$emit('success', this.path)
        }

    }

}
</script>

<style lang="scss">
image {
    width: 100%;
    height: 100%;
    border-radius: 15rpx;
   




}
</style>