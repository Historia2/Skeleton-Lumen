export const getUniqueId = () => {
	var now = new Date();
	let id = "";
	id += now.getFullYear().toString();
	id += now.getMonth().toString();
	id += now.getDate().toString();
	id += now.getHours().toString();
	id += now.getMinutes().toString();
	id += now.getSeconds().toString();
	return id;
}

export const getExpire = (length = 0) => {
	var now = new Date();
	let id = [
        now.getFullYear().toString(),
        now.getMonth().toString(),
        now.getDate().toString(),
        now.getHours().toString()
    ];
    id[2] = (parseInt(id[2]) + length).toString();
	return parseInt((id[0]+id[1]+id[2]+id[3]));
}

export const moneyFormatter = (money = 0, usePrefix = true) => {
    // alert(this.value)
    if ((money / 1000000000) >= 1) {
        return (((money / 1000000000).toFixed(2) * 100) / 100) + (usePrefix ? ' M' : '');
    } else if ((money / 1000000) >= 1) {
        return (((money / 1000000).toFixed(2) * 100) / 100) + (usePrefix ? ' Juta' : '');
    }else{
        return Math.floor(money);
    }
}

export const moneyParser = (money) => {
    // alert(this.value)
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    })
    return formatter.format(money);
}

export const dateFormater = (date = "0000-00-00") => {
    const months = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    date = date.split('-');
    return `${date[2].split(' ')[0]} ${months[parseInt(date[1] - 1)]} ${date[0]}`;
}