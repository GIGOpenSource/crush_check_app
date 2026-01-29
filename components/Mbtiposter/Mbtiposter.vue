<template>
    <view>
        <image :src="path" mode="widthFix" @load="success"></image>
        <l-painter ref="painter" @success="handleSuccess" @fail="handleFail" hidden path-type="url" width="600rpx" height="100%"
            :canvas-id="canvasId" isCanvasToTempFilePath file-type="jpg" :quality="0.5" :pixel-ratio="1">
            <l-painter-view
                css="width: 100%; height: 100%;color: #000;background: #ffffff;font-size: 26rpx;padding: 20rpx 20rpx;box-sizing: border-box;">
                <l-painter-view css="width: 100%;border-radius: 10rpx; padding: 20rpx 0; box-sizing: border-box;">
                    <!-- 类型 -->
                    <l-painter-view css="display: flex;align-items: center;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-text text='你的人格类型为：'
                                css="display: block;width: 100%;text-align: center;font-size: 26rpx;"></l-painter-text>
                            <l-painter-text text='INTJ-A 建筑师'
                                css="display: block;width: 100%;text-align: center;margin: 30rpx 0;font-size: 32rpx;color:#955EB1">
                            </l-painter-text>
                            <l-painter-text text='没关系 发生意外也是计划之内的事情 还好 好像有点那啥 知识囤积癖'
                                css="display: block;width: 70%;text-align: center;font-size: 24rpx;line-height: 38rpx;">
                            </l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <!-- 图像 -->
                    <l-painter-view css="display: flex;align-items: center;margin: 30rpx 80rpx;">
                        <l-painter-view css="display: flex;align-items: center;justify-content: center;">
                            <l-painter-image :src="$getImg('index/bg')"
                                css="width: 200rpx; height: 200rpx; display: block;margin-right: 20rpx;"></l-painter-image>
                            <l-painter-view css="display: block;font-size: 36rpx;">
                                <l-painter-text text='流行图鉴：紫老头' css="display: block;"> </l-painter-text>
                                <l-painter-text text='人数占比：1.26%' css="display: block;"> </l-painter-text>
                            </l-painter-view>


                        </l-painter-view>

                    </l-painter-view>
                    <!-- 各项人格占比 -->
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-text text='各项人格占比'
                                css="margin: 20rpx 0;display: block;width: 100%;text-align: center;font-size: 26rpx;font-weight: 400;"></l-painter-text>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text text='外向（E）'> </l-painter-text>
                                <l-painter-text text='内向（I）' css="color:#4695B4"> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text text='10%'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;">
                                    <l-painter-view
                                        css="position: absolute; right: 0; top: 0; width:90%; height:20rpx; border-radius: 10rpx; background: #4695B4;">
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text text='90%'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #F1F6F9;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text text='与周围关键互动：'> </l-painter-text>
                                    <l-painter-text text='内向型（Introverted）' css="color:#4D93AD;"> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        text='善于独立思考，关注内心世界，喜欢在内心探索自己的想法和情 感。倾向于选择有意义社交活动。'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text text='现实（S）'> </l-painter-text>
                                <l-painter-text text='直觉（N）' css="color:#E8AC3F"> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text text='10%'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;">
                                    <l-painter-view
                                        css="position: absolute; right: 0; top: 0; width:90%; height:20rpx; border-radius: 10rpx; background: #E8AC3F;">
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text text='90%'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #FDF9F0;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text text='与周围关键互动：'> </l-painter-text>
                                    <l-painter-text text='内向型（Introverted）' css="color:#E8AC3F"> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        text='善于独立思考，关注内心世界，喜欢在内心探索自己的想法和情 感。倾向于选择有意义社交活动。'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text text='逻辑（T）' css="color:#35A374"> </l-painter-text>
                                <l-painter-text text='感受（F）'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text text='10%'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;">
                                    <l-painter-view
                                        css="position: absolute; left: 0; top: 0; width:90%; height:20rpx; border-radius: 10rpx; background: #35A374;">
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text text='90%'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #F0F9F4;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text text='与周围关键互动：'> </l-painter-text>
                                    <l-painter-text text='内向型（Introverted）' css="color:#35A374"> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        text='善于独立思考，关注内心世界，喜欢在内心探索自己的想法和情 感。倾向于选择有意义社交活动。'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text text='计划（J）' css="color:#8B5E99"> </l-painter-text>
                                <l-painter-text text='展望（P）'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text text='10%'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;">
                                    <l-painter-view
                                        css="position: absolute; left: 0; top: 0; width:90%; height:20rpx; border-radius: 10rpx; background: #8B5E99;">
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text text='90%'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #F6F4F7;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text text='与周围关键互动：'> </l-painter-text>
                                    <l-painter-text text='内向型（Introverted）' css="color:#8B5E99"> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        text='善于独立思考，关注内心世界，喜欢在内心探索自己的想法和情 感。倾向于选择有意义社交活动。'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text text='坚决（A）' css="color:#F36067"> </l-painter-text>
                                <l-painter-text text='谨慎（T）'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text text='10%'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;">
                                    <l-painter-view
                                        css="position: absolute; left: 0; top: 0; width:90%; height:20rpx; border-radius: 10rpx; background: #F36067;">
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text text='90%'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background:#FEF4F3;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text text='与周围关键互动：'> </l-painter-text>
                                    <l-painter-text text='内向型（Introverted）' css="color:#F36067"> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        text='善于独立思考，关注内心世界，喜欢在内心探索自己的想法和情 感。倾向于选择有意义社交活动。'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <!-- 人格类型分析 -->
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-text text='人格类型解析'
                                css="margin: 20rpx 0;display: block;width: 100%;text-align: center;font-size: 26rpx;font-weight: 400;"></l-painter-text>

                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='INTJ' css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text text='是谁' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text text='hahahahaahhahahahhahahahahahahahhahhhhhhhhhhhhhh'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='INTJ' css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text text='优劣势' css=""></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="margin: 20rpx 0;display: flex;width: 100%;justify-content: space-between;">
                            <l-painter-view
                                css="width: 48%;background: #FAF5FB;border-radius: 15rpx; flex-direction: column;align-items: center;justify-content: center;text-align: center;padding:20rpx 0;">
                                <l-painter-text text='优势' css="background: #D0B8D8;display: block;width:150rpx;height:60rpx;line-height:60rpx;text-align:center;border-radius: 30rpx;margin: 0 auto;margin-bottom:20rpx;"></l-painter-text>
                                <l-painter-text text='• 新颖的思考方式' css="display: block;line-height: 50rpx;" v-for="value in 5" :key="value"></l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width: 48%;background: #F9F9F9;border-radius: 15rpx; flex-direction: column;align-items: center;justify-content: center;text-align: center;padding:20rpx 0;">
                                <l-painter-text text='劣势' css="background: #E6E6E6;display: block;width:150rpx;height:60rpx;line-height:60rpx;text-align:center;border-radius: 30rpx;margin: 0 auto;margin-bottom:20rpx;"></l-painter-text>
                                <l-painter-text text='• 不遵守规则' css="display: block;line-height: 50rpx;" v-for="value in 5" :key="value"></l-painter-text>
                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='INTJ' css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text text='的烦恼' css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text text='hahahahaahhahahahhahahahahahahahhahhhhhhhhhhhhhh'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text text='INTJ' css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text text='对待感情...' css="color:#000;font-weight:bolder"></l-painter-text>
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
    name: "Mbtiposter",
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
            canvasId: `mbti-poster-single-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // 唯一的canvasId
        };
    },
    created() {

    },
    mounted() {
        // 在生成海报前清理小程序缓存
        this.clearTempFiles()
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