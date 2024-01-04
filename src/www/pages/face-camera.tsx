import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { useTranslation } from '../translation'
import { createRouteComponent } from './route-component'
import e from 'express'
// import { cv480 as cv, waitCvRuntimeInitialized } from '../../shared/opencv'

export const FaceCamera = createRouteComponent({
	path: "facecam",
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const videoCapRef = useRef<readonly [ HTMLCanvasElement, CanvasRenderingContext2D] | null>(null)
	const divRef = useRef<HTMLDivElement| null>(null)
	const init_opencv_camera = useCallback(async function (video: HTMLVideoElement) {
		// await waitCvRuntimeInitialized()
		streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
		video.srcObject = streamRef.current;
		video.play();
		const canvas = document.createElement('canvas')
		canvas.width = streamRef.current.getVideoTracks()[0].getSettings().width || 0
		canvas.height = streamRef.current.getVideoTracks()[0].getSettings().height || 0
		const ctx = canvas.getContext('2d')!
		videoCapRef.current = [canvas, ctx]
	}, [])
	const close_opencv_camera = useCallback(async function () {
		streamRef.current?.getTracks()[0].stop()
		streamRef.current = null
		videoCapRef.current = null
	}, [])
	const handle_click = useCallback(async function (ev: React.MouseEvent){
		// await waitCvRuntimeInitialized()
		if(videoCapRef.current && videoRef.current){
			const [canvas, ctx] = videoCapRef.current
			ctx.drawImage(videoRef.current, 0, 0);
			const dataurl = canvas.toDataURL("image/jpeg", 0.85);
			const b64 = dataurl.split(',', 2)[1]
			const res = await fetch("http://localhost:8082/api/detect", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				},
				body: JSON.stringify(b64)
			})
			if(res.ok){
				const features = await res.json()
				if(divRef.current){
					divRef.current.innerHTML=features.map((x:any)=>{
						return `
						<img src="data:image/jpg;base64,${x.aligned_face}" />
						`
					}).join("")
				}
			}else{
				if(divRef.current){
					divRef.current.innerHTML=""
				}
			}
		}
	}, [])
	useEffect(() => {
		if (videoRef.current) {
			console.log("init_opencv_camera")
			init_opencv_camera(videoRef.current)
		}
		return () => {
			console.log("close facecam")
			close_opencv_camera()
		}
	}, [videoRef.current])
	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className='col-6'>
					<h1>
						Face Camera
					</h1>
				</div>
			</div>
			<button onClick={handle_click}>Get Features</button>
			<div ref={divRef}></div>
			<div className='row mt-5'>
				<div className='col'>
					<video ref={videoRef} />
				</div>
			</div>
		</div>
	)
})
