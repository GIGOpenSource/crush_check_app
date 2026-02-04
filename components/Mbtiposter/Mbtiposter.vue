<template>
    <view>
        <image v-if="path" :src="path" mode="widthFix" @load="success" @error="handleImageError"></image>
        <l-painter ref="painter" @success="handleSuccess" @fail="handleFail" hidden path-type="url" width="700rpx" height="100%"
            :canvas-id="canvasId" isCanvasToTempFilePath file-type="jpg" :quality="0.95" :pixel-ratio="3">
            <l-painter-view
                css="width: 100%; height: 100%;color: #000;background: #ffffff;font-size: 26rpx;padding: 20rpx 20rpx;box-sizing: border-box;">
                <l-painter-view css="width: 100%;border-radius: 10rpx; padding: 20rpx 0; box-sizing: border-box;">
                    <!-- 类型 -->
                    <l-painter-view css="display: flex;align-items: center;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-text :text="t('mbti.personalityTypeLabel')"
                                css="display: block;width: 100%;text-align: center;font-size: 26rpx;"></l-painter-text>
                            <l-painter-text :text="info.mbti_list[0].mbti_type + ' '+info.mbti_list[0].templates[0].popular_name"
                                css="display: block;width: 100%;text-align: center;margin: 30rpx 0;font-size: 32rpx;color:#955EB1">
                            </l-painter-text>
                            <l-painter-text :text="info.mbti_list[0].templates[0].summary || '--'"
                                css="display: block;width: 70%;text-align: center;font-size: 24rpx;line-height: 38rpx;">
                            </l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <!-- 图像 -->
                    <l-painter-view css="display: flex;align-items: center;margin: 30rpx 80rpx;">
                        <l-painter-view css="display: flex;align-items: center;justify-content: center;">
                            <l-painter-image :src="info.mbti_list[0].templates[0].image_url"
                                css="width: 200rpx; height: 200rpx; display: block;margin-right: 20rpx;"></l-painter-image>
                            <l-painter-view css="display: block;font-size: 36rpx;">
                                <l-painter-text :text="t('mbti.popularCatalog') + info.mbti_list[0].templates[0].mbti_nickname" css="display: block;"> </l-painter-text>
                                <l-painter-text :text="t('mbti.populationRatio') + info.mbti_list[0].templates[0].population_ratio +'%'" css="display: block;"> </l-painter-text>
                            </l-painter-view>


                        </l-painter-view>

                    </l-painter-view>
                    <!-- 各项人格占比 -->
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-text :text="t('mbti.personalityProportion')"
                                css="margin: 20rpx 0;display: block;width: 100%;text-align: center;font-size: 26rpx;font-weight: 400;"></l-painter-text>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text :text="t('mbti.extroverted')" :css='getETextStyle()'> </l-painter-text>
                                <l-painter-text :text="t('mbti.introverted')" :css='getITextStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text :text='getEPercentage + "%"' :css='getEPercentageStyle()'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;position: relative;">
                                    <l-painter-view
                                        :css='getProgressBarStyle()'>
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text :text='getIPercentage + "%"' :css='getIPercentageStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #F1F6F9;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text :text="t('mbti.energySource')"> </l-painter-text>
                                    <l-painter-text :text='getEITitleText()' :css='getEITitleStyle()'> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        :text='getEIDescriptionText()'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text :text="t('mbti.sensing')" :css='getSTextStyle()'> </l-painter-text>
                                <l-painter-text :text="t('mbti.intuitive')" :css='getNTextStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text :text='getSPercentage + "%"' :css='getSPercentageStyle()'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;position: relative;">
                                    <l-painter-view
                                        :css='getSNProgressBarStyle()'>
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text :text='getNPercentage + "%"' :css='getNPercentageStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #FDF9F0;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text :text="t('mbti.informationAcquisition')"> </l-painter-text>
                                    <l-painter-text :text='getSNTitleText()' :css='getSNTitleStyle()'> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        :text='getSNDescriptionText()'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text :text="t('mbti.thinking')" :css='getTTextStyle()'> </l-painter-text>
                                <l-painter-text :text="t('mbti.feeling')" :css='getFTextStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text :text='getTPercentage + "%"' :css='getTPercentageStyle()'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;position: relative;">
                                    <l-painter-view
                                        :css='getTFProgressBarStyle()'>
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text :text='getFPercentage + "%"' :css='getFPercentageStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #F0F9F4;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text :text="t('mbti.decisionMaking')"> </l-painter-text>
                                    <l-painter-text :text='getTFTitleText()' :css='getTFTitleStyle()'> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        :text='getTFDescriptionText()'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text :text="t('mbti.judging')" :css='getJTextStyle()'> </l-painter-text>
                                <l-painter-text :text="t('mbti.perceiving')" :css='getPTextStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width:100%;margin: 10rpx 0;align-items: center;">
                                <l-painter-text :text='getJPercentage + "%"' :css='getJPercentageStyle()'> </l-painter-text>
                                <l-painter-view
                                    css="display:block;width:75%; background: #EBEBEB;height:20rpx;border-radius: 10rpx;position: relative;">
                                    <l-painter-view
                                        :css='getJPProgressBarStyle()'>
                                    </l-painter-view>
                                </l-painter-view>
                                <l-painter-text :text='getPPercentage + "%"' :css='getPPercentageStyle()'> </l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width:100%;margin: 10rpx 0;background: #F6F4F7;padding: 20rpx;border-radius: 15rpx;">
                                <l-painter-view css="display: block;font-size: 26rpx;">
                                    <l-painter-text :text="t('mbti.lifestyle')"> </l-painter-text>
                                    <l-painter-text :text='getJPTitleText()' :css='getJPTitleStyle()'> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        :text='getJPDescriptionText()'> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-view
                                css="display: flex;justify-content: space-between; width: 80%;margin-top: 20rpx;color:#9C9C9C">
                                <l-painter-text :text="t('mbti.assertive')" css="color:#F36067"> </l-painter-text>
                                <l-painter-text :text="t('mbti.turbulent')"> </l-painter-text>
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
                                    <l-painter-text :text="t('mbti.confidenceLevel')"> </l-painter-text>
                                    <l-painter-text :text="t('mbti.introvertedType')" css="color:#F36067"> </l-painter-text>
                                </l-painter-view>
                                <l-painter-view css="display: block;color:#3D3D3D;margin-top: 15rpx;">
                                    <l-painter-text css="font-size: 22rpx;display: block;"
                                        :text="t('mbti.introvertedDescription')"> </l-painter-text>
                                </l-painter-view>

                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <!-- 人格类型分析 -->
                    <l-painter-view css="display: flex;align-items: center; margin: 0 20rpx;">
                        <l-painter-view
                            css="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;">
                            <l-painter-text :text="t('mbti.personalityAnalysis')"
                                css="margin: 20rpx 0;display: block;width: 100%;text-align: center;font-size: 26rpx;font-weight: 400;"></l-painter-text>

                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text :text="info.mbti_list[0].mbti_type" css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text :text="t('mbti.whoIs')" css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text :text='info.mbti_list[0].templates[0].identity_description'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text :text="info.mbti_list[0].mbti_type" css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text :text="t('mbti.strengthsWeaknesses')" css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="margin: 20rpx 0;display: flex;width: 100%;justify-content: space-between;">
                            <l-painter-view
                                css="width: 48%;background: #FAF5FB;border-radius: 15rpx; flex-direction: column;align-items: center;justify-content: center;text-align: center;padding:20rpx 0;">
                                <l-painter-text :text="t('mbti.strengths')" css="background: #D0B8D8;display: block;width:150rpx;height:60rpx;line-height:60rpx;text-align:center;border-radius: 30rpx;margin: 0 auto;margin-bottom:20rpx;"></l-painter-text>
                                <l-painter-text :text='value' css="display: block;line-height: 50rpx;" v-for="value in info.mbti_list[0].templates[0].strengths.split('，')" :key="value"></l-painter-text>
                            </l-painter-view>
                            <l-painter-view
                                css="width: 48%;background: #F9F9F9;border-radius: 15rpx; flex-direction: column;align-items: center;justify-content: center;text-align: center;padding:20rpx 0;">
                                <l-painter-text :text="t('mbti.weaknesses')" css="background: #E6E6E6;display: block;width:150rpx;height:60rpx;line-height:60rpx;text-align:center;border-radius: 30rpx;margin: 0 auto;margin-bottom:20rpx;"></l-painter-text>
                                <l-painter-text :text='value' css="display: block;line-height: 50rpx;" v-for="value in info.mbti_list[0].templates[0].weaknesses.split('，')" :key="value"></l-painter-text>
                            </l-painter-view>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text :text="info.mbti_list[0].mbti_type" css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text :text="t('mbti.worries')" css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text :text='info.mbti_list[0].templates[0].worries'
                                css=""></l-painter-text>
                        </l-painter-view>

                    </l-painter-view>
                    <l-painter-view css="margin: 0 20rpx;">
                        <l-painter-view>
                            <l-painter-text :text="info.mbti_list[0].mbti_type" css="color:#8B5E99;margin-right: 15rpx;"></l-painter-text>
                            <l-painter-text :text="t('mbti.loveAttitude')" css="color:#000;font-weight:bolder"></l-painter-text>
                        </l-painter-view>
                        <l-painter-view css="padding:20rpx;background: #F6F4F7;border-radius: 15rpx;margin: 20rpx 0;">
                            <l-painter-text :text='info.mbti_list[0].templates[0].love_attitude'
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
import { t as i18nT } from '@/i18n/index.js';
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
        // 国际化翻译函数
        t(key) {
            return t(key)
        }
    },
    computed: {
        // 计算外向（E）的百分比，四舍五入为整数，确保与内向相加为100
        getEPercentage() {
            if (!this.info || !this.info.mbti_list || !this.info.mbti_list[0] || !this.info.mbti_list[0].base_scores) {
                return 0
            }
            const E = this.info.mbti_list[0].base_scores.E || 0
            const I = this.info.mbti_list[0].base_scores.I || 0
            const total = E + I
            if (total === 0) return 0
            
            // 计算百分比并四舍五入
            const ePercent = Math.round((E / total) * 100)
            // 内向百分比 = 100 - 外向百分比，确保和为100
            const iPercent = 100 - ePercent
            
            return ePercent
        },
        // 计算内向（I）的百分比，四舍五入为整数，确保与外向相加为100
        getIPercentage() {
            if (!this.info || !this.info.mbti_list || !this.info.mbti_list[0] || !this.info.mbti_list[0].base_scores) {
                return 0
            }
            const E = this.info.mbti_list[0].base_scores.E || 0
            const I = this.info.mbti_list[0].base_scores.I || 0
            const total = E + I
            if (total === 0) return 0
            
            // 计算外向百分比并四舍五入
            const ePercent = Math.round((E / total) * 100)
            // 内向百分比 = 100 - 外向百分比，确保和为100
            const iPercent = 100 - ePercent
            
            return iPercent
        },
        // 判断外向值是否更大
        isEGreater() {
            return this.getEPercentage > this.getIPercentage
        },
        // 判断内向值是否更大
        isIGreater() {
            return this.getIPercentage > this.getEPercentage
        },
        // SN相关计算
        getSPercentage() {
            if (!this.info || !this.info.mbti_list || !this.info.mbti_list[0] || !this.info.mbti_list[0].base_scores) {
                return 0
            }
            const S = this.info.mbti_list[0].base_scores.S || 0
            const N = this.info.mbti_list[0].base_scores.N || 0
            const total = S + N
            if (total === 0) return 0
            return Math.round((S / total) * 100)
        },
        getNPercentage() {
            return 100 - this.getSPercentage
        },
        isSGreater() {
            return this.getSPercentage > this.getNPercentage
        },
        isNGreater() {
            return this.getNPercentage > this.getSPercentage
        },
        // TF相关计算
        getTPercentage() {
            if (!this.info || !this.info.mbti_list || !this.info.mbti_list[0] || !this.info.mbti_list[0].base_scores) {
                return 0
            }
            const T = this.info.mbti_list[0].base_scores.T || 0
            const F = this.info.mbti_list[0].base_scores.F || 0
            const total = T + F
            if (total === 0) return 0
            return Math.round((T / total) * 100)
        },
        getFPercentage() {
            return 100 - this.getTPercentage
        },
        isTGreater() {
            return this.getTPercentage > this.getFPercentage
        },
        isFGreater() {
            return this.getFPercentage > this.getTPercentage
        },
        // JP相关计算
        getJPercentage() {
            if (!this.info || !this.info.mbti_list || !this.info.mbti_list[0] || !this.info.mbti_list[0].base_scores) {
                return 0
            }
            const J = this.info.mbti_list[0].base_scores.J || 0
            const P = this.info.mbti_list[0].base_scores.P || 0
            const total = J + P
            if (total === 0) return 0
            return Math.round((J / total) * 100)
        },
        getPPercentage() {
            return 100 - this.getJPercentage
        },
        isJGreater() {
            return this.getJPercentage > this.getPPercentage
        },
        isPGreater() {
            return this.getPPercentage > this.getJPercentage
        }
    },
    methods: {
        // 国际化翻译函数
        t(key) {
            return i18nT(key)
        },
        // 获取外向文本样式（相等时显示左边的值）
        getETextStyle() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            // 如果E大于等于I（包括相等），显示颜色
            return ePercent >= iPercent ? 'color:#4695B4' : ''
        },
        // 获取内向文本样式
        getITextStyle() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            // 只有I大于E时才显示颜色
            return iPercent > ePercent ? 'color:#4695B4' : ''
        },
        // 获取外向百分比样式（相等时显示左边的值）
        getEPercentageStyle() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            // 如果E大于等于I（包括相等），显示黑色
            return ePercent >= iPercent ? 'color:#000000' : ''
        },
        // 获取内向百分比样式
        getIPercentageStyle() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            // 只有I大于E时才显示黑色
            return iPercent > ePercent ? 'color:#000000' : ''
        },
        // 获取进度条样式
        getProgressBarStyle() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            
            // 如果外向值大，进度条从左边开始
            if (ePercent > iPercent) {
                return `position: absolute; left: 0; top: 0; width:${ePercent}%; height:20rpx; border-radius: 10rpx; background: #4695B4;`
            } else {
                // 如果内向值大，进度条从右边开始
                return `position: absolute; right: 0; top: 0; width:${iPercent}%; height:20rpx; border-radius: 10rpx; background: #4695B4;`
            }
        },
        // SN相关样式方法（相等时显示左边的值）
        getSTextStyle() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            // 如果S大于等于N（包括相等），显示颜色
            return sPercent >= nPercent ? 'color:#E8AC3F' : ''
        },
        getNTextStyle() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            // 只有N大于S时才显示颜色
            return nPercent > sPercent ? 'color:#E8AC3F' : ''
        },
        getSPercentageStyle() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            // 如果S大于等于N（包括相等），显示黑色
            return sPercent >= nPercent ? 'color:#000000' : ''
        },
        getNPercentageStyle() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            // 只有N大于S时才显示黑色
            return nPercent > sPercent ? 'color:#000000' : ''
        },
        getSNProgressBarStyle() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            
            if (sPercent > nPercent) {
                return `position: absolute; left: 0; top: 0; width:${sPercent}%; height:20rpx; border-radius: 10rpx; background: #E8AC3F;`
            } else {
                return `position: absolute; right: 0; top: 0; width:${nPercent}%; height:20rpx; border-radius: 10rpx; background: #E8AC3F;`
            }
        },
        // TF相关样式方法（相等时显示左边的值）
        getTTextStyle() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            // 如果T大于等于F（包括相等），显示颜色
            return tPercent >= fPercent ? 'color:#35A374' : ''
        },
        getFTextStyle() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            // 只有F大于T时才显示颜色
            return fPercent > tPercent ? 'color:#35A374' : ''
        },
        getTPercentageStyle() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            // 如果T大于等于F（包括相等），显示黑色
            return tPercent >= fPercent ? 'color:#000000' : ''
        },
        getFPercentageStyle() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            // 只有F大于T时才显示黑色
            return fPercent > tPercent ? 'color:#000000' : ''
        },
        getTFProgressBarStyle() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            
            if (tPercent > fPercent) {
                return `position: absolute; left: 0; top: 0; width:${tPercent}%; height:20rpx; border-radius: 10rpx; background: #35A374;`
            } else {
                return `position: absolute; right: 0; top: 0; width:${fPercent}%; height:20rpx; border-radius: 10rpx; background: #35A374;`
            }
        },
        // JP相关样式方法（相等时显示左边的值）
        getJTextStyle() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            // 如果J大于等于P（包括相等），显示颜色
            return jPercent >= pPercent ? 'color:#8B5E99' : ''
        },
        getPTextStyle() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            // 只有P大于J时才显示颜色
            return pPercent > jPercent ? 'color:#8B5E99' : ''
        },
        getJPercentageStyle() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            // 如果J大于等于P（包括相等），显示黑色
            return jPercent >= pPercent ? 'color:#000000' : ''
        },
        getPPercentageStyle() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            // 只有P大于J时才显示黑色
            return pPercent > jPercent ? 'color:#000000' : ''
        },
        getJPProgressBarStyle() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            
            if (jPercent > pPercent) {
                return `position: absolute; left: 0; top: 0; width:${jPercent}%; height:20rpx; border-radius: 10rpx; background: #8B5E99;`
            } else {
                return `position: absolute; right: 0; top: 0; width:${pPercent}%; height:20rpx; border-radius: 10rpx; background: #8B5E99;`
            }
        },
        // 获取EI标题文本（根据数值大小动态显示，相等时显示左边的值）
        getEITitleText() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            if (iPercent > ePercent) {
                return this.t('mbti.introvertedType')
            } else {
                // 相等或E更大时，显示左边的值（外向型）
                return this.t('mbti.extrovertedType')
            }
        },
        // 获取SN标题文本（根据数值大小动态显示，相等时显示左边的值）
        getSNTitleText() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            if (nPercent > sPercent) {
                return this.t('mbti.intuitiveType')
            } else {
                // 相等或S更大时，显示左边的值（现实型）
                return this.t('mbti.sensingType')
            }
        },
        // 获取TF标题文本（根据数值大小动态显示，相等时显示左边的值）
        getTFTitleText() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            if (fPercent > tPercent) {
                return this.t('mbti.feelingType')
            } else {
                // 相等或T更大时，显示左边的值（逻辑型）
                return this.t('mbti.thinkingType')
            }
        },
        // 获取JP标题文本（根据数值大小动态显示，相等时显示左边的值）
        getJPTitleText() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            if (pPercent > jPercent) {
                return this.t('mbti.perceivingType')
            } else {
                // 相等或J更大时，显示左边的值（计划型）
                return this.t('mbti.judgingType')
            }
        },
        // 获取EI描述文本（根据类型动态显示）
        getEIDescriptionText() {
            const ePercent = this.getEPercentage
            const iPercent = this.getIPercentage
            if (iPercent > ePercent) {
                // 内向型描述
                return this.t('mbti.introvertedDescription')
            } else {
                // 外向型描述（包括相等时显示左边的值）
                return this.t('mbti.extrovertedDescription')
            }
        },
        // 获取EI标题样式（与进度条颜色一致）
        getEITitleStyle() {
            // EI进度条颜色是 #4695B4
            return 'color:#4695B4'
        },
        // 获取SN描述文本（根据类型动态显示）
        getSNDescriptionText() {
            const sPercent = this.getSPercentage
            const nPercent = this.getNPercentage
            if (nPercent > sPercent) {
                // N型（直觉型）描述
                return this.t('mbti.intuitiveDescription')
            } else {
                // S型（现实型）描述（包括相等时显示左边的值）
                return this.t('mbti.sensingDescription')
            }
        },
        // 获取SN标题样式（与进度条颜色一致）
        getSNTitleStyle() {
            // SN进度条颜色是 #E8AC3F
            return 'color:#E8AC3F'
        },
        // 获取TF描述文本（根据类型动态显示）
        getTFDescriptionText() {
            const tPercent = this.getTPercentage
            const fPercent = this.getFPercentage
            if (fPercent > tPercent) {
                // F型（感受型）描述
                return this.t('mbti.feelingDescription')
            } else {
                // T型（逻辑型）描述（包括相等时显示左边的值）
                return this.t('mbti.thinkingDescription')
            }
        },
        // 获取TF标题样式（与进度条颜色一致）
        getTFTitleStyle() {
            // TF进度条颜色是 #35A374
            return 'color:#35A374'
        },
        // 获取JP描述文本（根据类型动态显示）
        getJPDescriptionText() {
            const jPercent = this.getJPercentage
            const pPercent = this.getPPercentage
            if (pPercent > jPercent) {
                // P型（展望型）描述
                return this.t('mbti.perceivingDescription')
            } else {
                // J型（计划型）描述（包括相等时显示左边的值）
                return this.t('mbti.judgingDescription')
            }
        },
        // 获取JP标题样式（与进度条颜色一致）
        getJPTitleStyle() {
            // JP进度条颜色是 #8B5E99
            return 'color:#8B5E99'
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
            console.log('海报生成成功，路径:', filePath)
            if (filePath) {
                this.path = filePath
                this.$emit('success', filePath)
                // 延迟清理，确保图片已加载和显示
                setTimeout(() => {
                    this.cleanupCanvas()
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
                title: '图片加载失败，请重试',
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