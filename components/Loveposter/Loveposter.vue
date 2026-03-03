<template>
    <view>
        <image v-if="path" :src="path" mode="widthFix" @load="success" @error="handleImageError"></image>
        <l-painter ref="painter" @success="handleSuccess" @fail="handleFail" hidden path-type="url" width="700rpx"
            height="100%" :canvas-id="canvasId" isCanvasToTempFilePath file-type="jpg" :quality="0.95" :pixel-ratio="3">
            <l-painter-view
                css="width: 100%; height: 100%;color: #fff;background:#2a2935;font-size: 26rpx;box-sizing: border-box; padding: 20rpx;">

                <l-painter-view css="width: 100%;border-radius: 10rpx;box-sizing: border-box;">
                    <!-- 标题 -->
                    <l-painter-view css="display: flex;flex-direction: column;align-items: center;">
                        <l-painter-text
                            css="display: block;margin:20rpx 0;width:100%;text-align: center;font-size: 30rpx;font-weight:bolder"
                            :text="t('lovePoster.title')"></l-painter-text>
                        <l-painter-text :text="t('lovePoster.caseNumber') + (info.business_data?.other_data.case_number || '--')"
                            css="font-size: 24rpx;"></l-painter-text>
                    </l-painter-view>
                    <!-- 对手信息 -->
                    <l-painter-view css="display: flex;flex-direction: column;margin-bottom: 20rpx;">
                        <l-painter-view
                            css="width: 100%;height: 100%;margin-top: 20rpx; border: 0.5px solid rgba(255, 255, 255, 0.17);padding: 20rpx;box-sizing: border-box;border-radius: 20rpx;background:#33323e">
                            <l-painter-view css="display: flex; flex-direction: row;margin-bottom: 20rpx;">
                                <l-painter-text :text="t('lovePoster.partyA') + (info.business_data?.self_data?.nickname || '')"
                                    css="color: rgba(255,255,255,0.9);display:block;width:50%"></l-painter-text>
                                <l-painter-text :text="t('lovePoster.partyB') + (info.business_data?.other_data?.nickname || '')"
                                    css="color: rgba(255,255,255,0.9);display:block;width:50%"></l-painter-text>
                            </l-painter-view>
                            <l-painter-text :text="t('lovePoster.presidingJudge') + (info.content?.presiding_judge || '')"
                                css="color: rgba(255,255,255,0.9); margin-bottom: 20rpx;"></l-painter-text>
                            <l-painter-text :text="t('lovePoster.openCourtTime') + (info.content?.open_court_time || '')"
                                css="color: rgba(255,255,255,0.9);"></l-painter-text>
                        </l-painter-view>
                    </l-painter-view>
                    <!-- 问题原因分析 -->
                    <l-painter-view css="display: flex;flex-direction: column;height: 100%;">
                        <l-painter-text :text="t('lovePoster.analysisTitle')"></l-painter-text>
                    </l-painter-view>
                     <l-painter-view  css="width: 100%;height: 100%;margin-top: 20rpx; border: 0.5px solid rgba(255, 255, 255, 0.17);padding: 20rpx;box-sizing: border-box;border-radius: 20rpx;background:#33323e">
                        <l-painter-text :text="info.content?.analysis || ''"></l-painter-text>
                    </l-painter-view>
                    <!-- 问题占比 -->
                    <l-painter-view css="display: flex;flex-direction: column;margin-top: 20rpx;">
                        <l-painter-text :text="t('lovePoster.proportionTitle')"></l-painter-text>
                        <!-- 占比条：上方名称 + 中间双色条 + 下方百分比 -->
                        <l-painter-view
                            css="width: 100%;height: 100%;margin-top: 20rpx; border: 0.5px solid rgba(255, 255, 255, 0.17);padding: 40rpx 40rpx;box-sizing: border-box;border-radius: 20rpx;background:#33323e">
                            <!-- 上方：左侧名称、右侧名称+百分比 -->
                            <l-painter-view
                                css="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 12rpx;">
                                <l-painter-text :text="(info.business_data?.self_data?.nickname || '')"
                                    css="color: #fff;"></l-painter-text>
                                <l-painter-text :text="(info.business_data?.other_data?.nickname || '')"
                                    css="color: #fff;"></l-painter-text>
                            </l-painter-view>
                            <!-- 中间：双色横向条（左绿右橙，圆角） -->
                            <l-painter-view
                                css="display: flex; flex-direction: row; width: 100%; height: 70rpx; border-radius: 10rpx;overflow: hidden;margin:10rpx 0;">
                                <l-painter-view :css="questionProportionLeftBarCss"></l-painter-view>
                                <l-painter-view :css="questionProportionRightBarCss"></l-painter-view>
                            </l-painter-view>
                            <!-- 下方：左侧百分比、右侧百分比（浅灰） -->
                            <l-painter-view
                                css="display: flex; flex-direction: row; justify-content: space-between; margin-top: 8rpx;">
                                <l-painter-text :text="(info.content?.percentage ?? 0) + '%'"
                                    css="color: rgba(255,255,255,0.6); font-size: 24rpx;"></l-painter-text>
                                <l-painter-text :text="(info.content?.other_percentage ?? 0) + '%'"
                                    css="color: rgba(255,255,255,0.6); font-size: 24rpx;"></l-painter-text>
                            </l-painter-view>
                        </l-painter-view>
                    </l-painter-view>
                    <!-- 最终判决 -->
                    <l-painter-view css="display: flex;flex-direction: column;margin-top: 20rpx;height: 100%;">
                        <l-painter-text :text="t('lovePoster.verdictTitle')"></l-painter-text>
                    </l-painter-view>
                    <l-painter-view
                        css="width: 100%;height: 100%;margin-top: 20rpx; border: 0.5px solid rgba(255, 255, 255, 0.17);padding: 20rpx;box-sizing: border-box;border-radius: 20rpx;background:#33323e">
                        <l-painter-text :text="info.content?.verdict || ''"></l-painter-text>
                    </l-painter-view>
                    <!-- 和解方案 -->
                    <l-painter-view css="display: flex;flex-direction: column;margin-top: 20rpx;height: 100%;">
                        <l-painter-text :text="t('lovePoster.resolutionTitle')"></l-painter-text>
                    </l-painter-view>
                    <l-painter-view
                        css="width: 100%;height: 100%;margin-top: 20rpx; border: 0.5px solid rgba(255, 255, 255, 0.17);padding: 20rpx;box-sizing: border-box;border-radius: 20rpx;background:#33323e">
                        <l-painter-text :text="info.content?.resolution || ''"></l-painter-text>
                    </l-painter-view>
                    <!-- 法官建议 -->
                    <l-painter-view css="display: flex;flex-direction: column;margin-top: 20rpx;">
                        <l-painter-text :text="t('lovePoster.judgeAdviceTitle')"></l-painter-text>
                    </l-painter-view>
                    <l-painter-view
                        css="width: 100%;height: 100%;display: block;margin-top: 20rpx; border: 0.5px solid rgba(255, 255, 255, 0.17);padding: 20rpx;box-sizing: border-box;border-radius: 20rpx;background:#33323e">
                        <l-painter-text :text="info.content?.judge_advice || ''"></l-painter-text>
                    </l-painter-view>
                    <!-- 判决时间 -->
                    <l-painter-view css="display: flex;flex-direction: column;margin-top: 30rpx;align-items: center;">
                        <l-painter-text css="color: rgba(255, 255, 255, 0.5);"
                            :text="t('lovePoster.verdictTime') + verdictTimeText"></l-painter-text>
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
import { t as i18nT } from '@/i18n/index.js';
export default {
    name: "Loveposter",
    props: {
        info: {
            type: Object,
            // 优化1：给默认值初始化child_list，避免访问时报错
            default: () => ({
                child_list: [],
                business_data: {
                    case_name: '',
                    self_data: {
                        nickname: ''
                    },
                    other_data: {
                        nickname: ''
                    }
                },
                content: {
                    percentage: 0,
                    other_percentage: 0
                }
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
            currentPosterPath: '', // 当前正在使用的海报路径，清理时排除
            // 问题占比条：左侧名称、右侧名称+百分比、左右占比（可后续从 info 接入）
            questionProportionLeftName: '吉吉',
            questionProportionRightName: '毛毛',
            questionProportionLeftPercent: 50,
            questionProportionRightPercent: 50,
            // 对手信息（可后续从 info 接入）
            opponentAName: '吉吉',
            opponentBName: '毛毛',
            judgeName: '长耳朵小兔法官',
            courtTimeDesc: '一个阳光刚好的下午茶时刻'
        };
    },
    computed: {
        // 将 last_used_time（ISO）格式化为 判决时间：YYYY/MM/DD HH:mm
        verdictTimeText() {
            const raw = this.info?.last_used_time
            if (!raw) return ''
            const d = new Date(raw)
            if (isNaN(d.getTime())) return raw
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            const h = String(d.getHours()).padStart(2, '0')
            const min = String(d.getMinutes()).padStart(2, '0')
            return `${y}/${m}/${day} ${h}:${min}`
        },
        questionProportionRightLabel() {
            return this.questionProportionRightName
        },
        // 进度条左侧样式（绿色），与项目内 background:#33323e 写法一致，确保 lime-painter 解析后能绘制
        questionProportionLeftBarCss() {
            const w = this.info?.content?.percentage ?? this.questionProportionLeftPercent ?? 0;
            return `width:${w}%;height:70rpx;background:#33A366;backgroundColor:#33A366`;
        },
        // 进度条右侧样式（橙黄色）
        questionProportionRightBarCss() {
            const w = this.info?.content?.other_percentage ?? this.questionProportionRightPercent ?? 0;
            return `width:${w}%;height:70rpx;background:#E6A23C;backgroundColor:#E6A23C`;
        },
        list() {
            const templates = this.info?.mbti_list?.[0]?.templates?.[0]
            if (!templates) {
                return []
            }
            return [
                {
                    t1: this.t('mbti.romanticMatch'),
                    t2: this.t('mbti.romanticMatchAnalysis'),
                    score: templates.romantic_relationship_score || 0
                },
                {
                    t1: this.t('mbti.friendshipMatch'),
                    t2: this.t('mbti.friendshipMatchAnalysis'),
                    score: templates.friendship_relationship_score || 0
                },
                {
                    t1: this.t('mbti.familyMatch'),
                    t2: this.t('mbti.familyMatchAnalysis'),
                    score: templates.family_relationship_score || 0
                }
            ]
        }
    },
    created() {

    },
    mounted() {
        // 在生成海报前清理小程序缓存（只清理旧文件，不清理当前文件）
        this.clearTempFiles()
    },
    beforeDestroy() {
        // 组件销毁前清理canvas资源
        this.cleanupCanvas()
    },
    methods: {
        // 国际化翻译函数
        t(key) {
            return i18nT(key)
        },
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
                                    // 获取当前正在使用的文件名（如果有）
                                    let currentFileName = ''
                                    if (this.currentPosterPath) {
                                        // 从路径中提取文件名，例如 wxfile://usr/1770194437452.jpeg -> 1770194437452.jpeg
                                        const pathParts = this.currentPosterPath.split('/')
                                        currentFileName = pathParts[pathParts.length - 1]
                                    }

                                    // 清理所有图片文件（jpg, png等），但排除当前正在使用的文件
                                    const imageExts = ['.jpg', '.jpeg', '.png', '.gif']
                                    const imageFiles = res.files
                                        .filter(file => {
                                            const ext = file.substring(file.lastIndexOf('.'))
                                            // 排除当前正在使用的文件
                                            if (currentFileName && file === currentFileName) {
                                                return false
                                            }
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
                // 清理APP临时文件目录（更激进的清理策略 - 清理所有旧文件）
                try {
                    const tempDirPath = '_doc/uniapp_temp'
                    // 获取当前正在使用的文件名（如果有）
                    let currentFileName = ''
                    if (this.currentPosterPath) {
                        // 从路径中提取文件名
                        const pathParts = this.currentPosterPath.split('/')
                        currentFileName = pathParts[pathParts.length - 1]
                    }

                    // 使用 plus.io 读取目录
                    plus.io.resolveLocalFileSystemURL(tempDirPath, (dirEntry) => {
                        // 检查是否是目录
                        if (dirEntry.isDirectory) {
                            const reader = dirEntry.createReader()
                            // 递归读取所有文件（readEntries可能需要多次调用）
                            const allEntries = []
                            const readAllEntries = () => {
                                reader.readEntries((entries) => {
                                    if (entries.length > 0) {
                                        allEntries.push(...entries)
                                        // 继续读取
                                        readAllEntries()
                                    } else {
                                        // 读取完成，清理所有图片文件，但排除当前文件
                                        const imageFiles = allEntries
                                            .filter(entry => {
                                                const name = entry.name || ''
                                                // 排除当前正在使用的文件
                                                if (currentFileName && name === currentFileName) {
                                                    return false
                                                }
                                                return /\.(jpg|jpeg|png|gif)$/i.test(name)
                                            })

                                        let cleaned = 0
                                        const totalFiles = imageFiles.length

                                        if (totalFiles === 0) {
                                            console.log('APP临时目录中没有图片文件')
                                            return
                                        }

                                        console.log(`准备清理 ${totalFiles} 个APP临时文件`)

                                        imageFiles.forEach(fileEntry => {
                                            fileEntry.remove(() => {
                                                cleaned++
                                                console.log(`已清理APP临时文件 ${cleaned}/${totalFiles}:`, fileEntry.name)
                                                // 如果清理完成，尝试强制垃圾回收
                                                if (cleaned === totalFiles) {
                                                    setTimeout(() => {
                                                        // 尝试强制垃圾回收（如果可用）
                                                        if (global.gc) {
                                                            global.gc()
                                                        }
                                                    }, 100)
                                                }
                                            }, (err) => {
                                                cleaned++
                                                // 忽略删除失败
                                                if (cleaned === totalFiles) {
                                                    setTimeout(() => {
                                                        if (global.gc) {
                                                            global.gc()
                                                        }
                                                    }, 100)
                                                }
                                            })
                                        })
                                    }
                                }, (err) => {
                                    // 读取目录失败，忽略（可能是空目录）
                                    console.log('读取APP目录失败:', err)
                                })
                            }
                            readAllEntries()
                        }
                    }, (err) => {
                        // 目录不存在，尝试创建目录（如果失败则忽略，不影响主流程）
                        if (err && err.code === 1) {
                            // 文件没有发现，尝试创建目录
                            try {
                                plus.io.resolveLocalFileSystemURL('_doc', (docEntry) => {
                                    docEntry.getDirectory('uniapp_temp', { create: true, exclusive: false }, () => {
                                        // 目录创建成功，不需要清理
                                        console.log('APP临时目录创建成功')
                                    }, () => {
                                        // 创建失败，忽略
                                        console.log('APP临时目录创建失败')
                                    })
                                }, () => {
                                    // 解析_doc失败，忽略
                                    console.log('解析_doc目录失败')
                                })
                            } catch (e) {
                                // 创建目录失败，忽略（不影响主流程）
                                console.log('创建APP临时目录异常:', e)
                            }
                        } else {
                            console.log('解析APP临时文件目录失败:', err)
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
            console.log('海报生成成功，路径:', filePath)
            if (filePath) {
                this.path = filePath
                // 保存当前海报路径，清理时排除
                this.currentPosterPath = filePath
                this.$emit('success', filePath)
                // 延迟清理，确保图片已加载和显示
                setTimeout(() => {
                    this.cleanupCanvas()
                    // 生成成功后延迟清理临时文件，但排除当前文件
                    setTimeout(() => {
                        this.clearTempFiles()
                    }, 3000) // 延迟3秒，确保图片已完全加载
                }, 2000)
            } else {
                console.error('海报路径为空')
                this.handleFail({ errMsg: '海报路径为空' })
            }
        },
        // 处理图片加载错误
        handleImageError(e) {
            console.error('图片加载失败:', e)
            uni.showToast({
                title: this.t('lovePoster.imageLoadFailed'),
                icon: 'none',
                duration: 2000
            })
        },
        // 处理生成失败
        handleFail(error) {
            console.error('海报生成失败:', error)
            this.cleanupCanvas()

            // 检查是否是存储空间不足的错误
            let errorMsg = ''
            if (error && error.errMsg) {
                if (error.errMsg.includes('maximum size') || error.errMsg.includes('storage limit')) {
                    errorMsg = this.t('poster.storageLimitExceeded') || '存储空间不足，请清理缓存后重试'
                } else {
                    errorMsg = error.errMsg
                }
            } else if (typeof error === 'string') {
                try {
                    const errorObj = JSON.parse(error)
                    if (errorObj.errMsg && (errorObj.errMsg.includes('maximum size') || errorObj.errMsg.includes('storage limit'))) {
                        errorMsg = this.t('poster.storageLimitExceeded') || '存储空间不足，请清理缓存后重试'
                    } else {
                        errorMsg = errorObj.errMsg || error
                    }
                } catch (e) {
                    errorMsg = error
                }
            } else {
                errorMsg = this.t('poster.generateFailed') || '海报生成失败，请重试'
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