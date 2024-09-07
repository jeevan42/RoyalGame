import React, { useState, useEffect } from 'react';
import { CovalentClient } from "@covalenthq/client-sdk";

function EventLog() {
    const [eventItems, setEventItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const client = new CovalentClient("cqt_rQVXFd7kyYchKkkxcTjQPh9jPXBg");
            try {
                const response = await client.BaseService.getLogEventsByAddress("scroll-sepolia-testnet","0xD48a9AD9c79c0811a058c9B6d8E3d34E9838110d", {"startingBlock": 4132032});
                console.log(response);
                if (response && response.items) {
                    setEventItems(response.items);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run effect only once

    return (
        <div>
            <h1>Event Log Items</h1>
            <ul>
                {eventItems.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    );
}

export default EventLog;
