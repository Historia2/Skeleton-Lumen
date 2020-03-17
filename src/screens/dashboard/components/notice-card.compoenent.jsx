import React, { Component } from 'react'
import { IoIosClose } from 'react-icons/io';
import { dateFormater } from 'components/helper';

export default class NoticeCardComponent extends Component {
    render() {
        const { action } = this.props;
        return (
            <div className="notice card">
                <IoIosClose className="icon" title="Close" onClick={e => action(0)} />
                <span className="description">
                    <span className="title">Perhatian</span>
                    { ` : Saat ini anda terdaftar dalam paket berlangganan ${localStorage.getItem('subsType')} 
                    dengan sisa masa aktif ${localStorage.getItem('subsTime')} Hari. 
                    Segera perpanjang paket berlangganan anda sebelum ${dateFormater(localStorage.getItem('subsDate'))} untuk dapat melanjutkan penggunaan situs Market Auction Price. `}
                    <a rel="noopener noreferrer" href="/dashboard/subscription" className="link" onClick={e => action(1)}>Perpanjang Sekarang</a> atau <span className="link" onClick={e => action(0)}>Nanti Saja</span>
                </span>
            </div>
        )
    }
}
