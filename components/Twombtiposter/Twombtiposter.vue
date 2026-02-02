<template>
    <view>
        <image :src="path" mode="widthFix" @load="success"></image>
        <l-painter ref="painter" @success="handleSuccess" @fail="handleFail" hidden path-type="url" width="700rpx" height="100%"
            :canvas-id="canvasId" isCanvasToTempFilePath file-type="jpg" :quality="0.95" :pixel-ratio="3">
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
                                <l-painter-image :src="$getImg('index/bg')"
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
                            <l-painter-text :text='info.mbti_list[0].templates[0].romantic_relationship'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='朋友伙伴关系匹配度分析' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text :text='info.mbti_list[0].templates[0].friendship_relationshi'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='家庭亲属关系匹配度分析' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text :text='info.mbti_list[0].templates[0].family_relationship'
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
        // 在生成海报前清理小程序缓存
        this.clearTempFiles()
        // 延迟再次清理，确保清理完成
        setTimeout(() => {
            this.clearTempFiles()
        }, 500)
    },
    beforeDestroy() {
        // 组件销毁前清理canvas资源
        this.cleanupCanvas()
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
                                    // 清理所有图片文件（jpg, png等），清理更多文件
                                    const imageExts = ['.jpg', '.jpeg', '.png', '.gif']
                                    const imageFiles = res.files
                                        .filter(file => {
                                            const ext = file.substring(file.lastIndexOf('.'))
                                            return imageExts.includes(ext.toLowerCase())
                                        })
                                        .sort()
                                        .slice(0, 20) // 清理更多旧文件（20个）
                                    
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
                                    .slice(0, 20) // 清理更多旧文件（20个）
                                
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