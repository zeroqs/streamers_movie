export function	addResolutionToFileName(fileName: string, resolution: string): string {
		if (resolution === "original") {
			return fileName; 
		} else {
			return `${fileName}_${resolution}.mp4`;
		}
	}