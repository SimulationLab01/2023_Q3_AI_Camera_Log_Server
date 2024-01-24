import { useCallback, useState } from 'react'

/** 將 css class 陣列整合成字串 */
export function classes(...cls: (string | undefined)[]): string {
	return cls.filter(x => !!x).join(' ')
}
function S(d: string) {
	function M(d: string) {
		let f = "";
		for (let _: number, m = "0123456789ABCDEF", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
		return f
	}
	function X(d: string) {
		let _: number[] = Array(d.length >> 2);
		for (let m = 0; m < _.length; m++)_[m] = 0;
		for (let m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
		return _
	}
	function V(d: number[]) {
		let _ = "";
		for (let m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
		return _
	}
	function Y(d: number[], _: number) {
		d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
		let m = 1732584193, f = -271733879, r = -1732584194, i = 271733878
		for (let n = 0; n < d.length; n += 16) {
			const h = m, t = f, g = r, e = i;
			f = ii(
				f = ii(
					f = ii(
						f = ii(
							f = hh(
								f = hh(
									f = hh(
										f = hh(
											f = gg(
												f = gg(
													f = gg(
														f = gg(
															f = ff(
																f = ff(
																	f = ff(
																		f = ff(
																			f, r = ff(
																				r, i = ff(
																					i, m = ff(
																						m, f, r, i, d[n + 0], 7, -680876936
																					), f, r, d[n + 1], 12, -389564586
																				), m, f, d[n + 2], 17, 606105819
																			), i, m, d[n + 3], 22, -1044525330
																		),
																		r = ff(
																			r, i = ff(
																				i, m = ff(
																					m, f, r, i, d[n + 4], 7, -176418897
																				), f, r, d[n + 5], 12, 1200080426
																			), m, f, d[n + 6], 17, -1473231341
																		), i, m, d[n + 7], 22, -45705983
																	),
																	r = ff(
																		r, i = ff(
																			i, m = ff(
																				m, f, r, i, d[n + 8], 7, 1770035416
																			), f, r, d[n + 9], 12, -1958414417
																		), m, f, d[n + 10], 17, -42063
																	), i, m, d[n + 11], 22, -1990404162
																),
																r = ff(
																	r, i = ff(
																		i, m = ff(
																			m, f, r, i, d[n + 12], 7, 1804603682
																		), f, r, d[n + 13], 12, -40341101
																	), m, f, d[n + 14], 17, -1502002290
																), i, m, d[n + 15], 22, 1236535329
															),
															r = gg(
																r, i = gg(
																	i, m = gg(
																		m, f, r, i, d[n + 1], 5, -165796510
																	), f, r, d[n + 6], 9, -1069501632
																), m, f, d[n + 11], 14, 643717713
															), i, m, d[n + 0], 20, -373897302
														),
														r = gg(
															r, i = gg(
																i, m = gg(
																	m, f, r, i, d[n + 5], 5, -701558691
																), f, r, d[n + 10], 9, 38016083
															), m, f, d[n + 15], 14, -660478335
														), i, m, d[n + 4], 20, -405537848
													),
													r = gg(
														r, i = gg(
															i, m = gg(
																m, f, r, i, d[n + 9], 5, 568446438
															), f, r, d[n + 14], 9, -1019803690
														), m, f, d[n + 3], 14, -187363961
													), i, m, d[n + 8], 20, 1163531501
												),
												r = gg(
													r, i = gg(
														i, m = gg(
															m, f, r, i, d[n + 13], 5, -1444681467
														), f, r, d[n + 2], 9, -51403784
													), m, f, d[n + 7], 14, 1735328473
												), i, m, d[n + 12], 20, -1926607734
											),
											r = hh(
												r, i = hh(
													i, m = hh(
														m, f, r, i, d[n + 5], 4, -378558
													), f, r, d[n + 8], 11, -2022574463
												), m, f, d[n + 11], 16, 1839030562
											), i, m, d[n + 14], 23, -35309556
										),
										r = hh(
											r, i = hh(
												i, m = hh(
													m, f, r, i, d[n + 1], 4, -1530992060
												), f, r, d[n + 4], 11, 1272893353
											), m, f, d[n + 7], 16, -155497632
										), i, m, d[n + 10], 23, -1094730640
									),
									r = hh(
										r, i = hh(
											i, m = hh(
												m, f, r, i, d[n + 13], 4, 681279174
											), f, r, d[n + 0], 11, -358537222
										), m, f, d[n + 3], 16, -722521979
									), i, m, d[n + 6], 23, 76029189
								),
								r = hh(
									r, i = hh(
										i, m = hh(
											m, f, r, i, d[n + 9], 4, -640364487
										), f, r, d[n + 12], 11, -421815835
									), m, f, d[n + 15], 16, 530742520
								), i, m, d[n + 2], 23, -995338651
							),
							r = ii(
								r, i = ii(
									i, m = ii(
										m, f, r, i, d[n + 0], 6, -198630844
									), f, r, d[n + 7], 10, 1126891415
								), m, f, d[n + 14], 15, -1416354905
							), i, m, d[n + 5], 21, -57434055
						),
						r = ii(
							r, i = ii(
								i, m = ii(
									m, f, r, i, d[n + 12], 6, 1700485571
								), f, r, d[n + 3], 10, -1894986606
							), m, f, d[n + 10], 15, -1051523
						), i, m, d[n + 1], 21, -2054922799
					),
					r = ii(
						r, i = ii(
							i, m = ii(
								m, f, r, i, d[n + 8], 6, 1873313359
							), f, r, d[n + 15], 10, -30611744
						), m, f, d[n + 6], 15, -1560198380
					), i, m, d[n + 13], 21, 1309151649
				),
				r = ii(
					r, i = ii(
						i, m = ii(
							m, f, r, i, d[n + 4], 6, -145523070
						), f, r, d[n + 11], 10, -1120210379
					), m, f, d[n + 2], 15, 718787259
				), i, m, d[n + 9], 21, -343485551
			), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
		}
		return [m, f, r, i]
	}
	function cmn(d: number, _: number, m: number, f: number, r: number, i: number) {
		return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m)
	}
	function ff(d: number, _: number, m: number, f: number, r: number, i: number, n: number) {
		return cmn(_ & m | ~_ & f, d, _, r, i, n)
	}
	function gg(d: number, _: number, m: number, f: number, r: number, i: number, n: number) {
		return cmn(_ & f | m & ~f, d, _, r, i, n)
	}
	function hh(d: number, _: number, m: number, f: number, r: number, i: number, n: number) {
		return cmn(_ ^ m ^ f, d, _, r, i, n)
	}
	function ii(d: number, _: number, m: number, f: number, r: number, i: number, n: number) {
		return cmn(m ^ (_ | ~f), d, _, r, i, n)
	}
	function safe_add(d: number, _: number) {
		const m = (65535 & d) + (65535 & _);
		return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m
	}
	function bit_rol(d: number, _: number) {
		return d << _ | d >>> 32 - _
	}
	let r = M(V(Y(X(d), 8 * d.length)));
	return r.toLowerCase()
};
const txtenc = new TextEncoder()
export async function hash(text1: string, text2: string) {
	const s1_text = S(text1)
	const s2_text = S(text2)
	const s_text = s1_text.slice(0, 16) + text2 + s2_text.slice(16, 32)
	const s_bytes = txtenc.encode(s_text)
	const hash_bytes = await window.crypto.subtle.digest('SHA-256', s_bytes)
	const hash_bytes_array = Array.from(new Uint8Array(hash_bytes))
	const hash_hex_string = hash_bytes_array.map(x => x.toString(16).padStart(2, '0')).join('')
	return hash_hex_string
}

export function format_template(template: string, ...params: any[]): string {
	return template.split("${}").map((x, i) => [x, new String(params[i] || "").toString()]).flat().join('')
}

export function useLocalStorage<T>(key: string, init: T) {
	const data = JSON.stringify(init)
	const load = useCallback<() => T>(() => {
		if (typeof window === 'undefined') {
			console.warn(`Error accessing client DOM`);
			return init;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : init;
		}
		catch (error) {
			console.warn(`Error reading localStorage key “${key}”:`, error);
			return init;
		}
	}, [key, data])
	const [medium, setMedium] = useState<T>(load())
	const save = useCallback<(val: T) => void>((val: T) => {
		if (typeof window === 'undefined') {
			console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
		}
		try {
			window.localStorage.setItem(key, JSON.stringify(val));
			setMedium(val);
		}
		catch (error) {
			console.warn(`Error setting localStorage key “${key}”:`, error);
		}
	}, [])
	return [medium, save] as const
}


export async function fetchapi<T = any>(method: "POST" | "GET", url: string, body?: any) {
	// url = "http://" + location.hostname + ":9000" + url;
	url = "http://20.196.65.188:9000" + url
	const res = await (async function(){
		if("GET"==method){
			const param = new URLSearchParams(body)
			url = url + "?" + param.toString()
			return await fetch(url, {
				method,
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				}
			})
		}else {
			return await fetch(url, {
				method,
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				},
				body: (body === undefined) ? undefined : JSON.stringify(body),
			})
		}
	})()
	
	if (res.ok) {
		const data = await res.json() as { code:number, result: T }
		if(data.code==0){
			return data.result
		}
		throw data.result
	} else {
		throw await res.json()
	}
}