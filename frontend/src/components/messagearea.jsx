import './messageare.css'
import roomStore from './activeroomstore';

function MessageArea({ messages, onMessageClick }) {
    const activeroom = roomStore((state) => state.activeroom);

    return (
        <div id='messagearea'>
            <div id="roominfo"
                style={{
                padding: "20px",
                color: "#fff",
                display: 'flex',
                fontFamily: 'ISOCPEUR',
                fontSize: "35px",
                borderTop: "2px solid #10192A",
                borderBottom: "2px solid #10192A",
                width: "130vh",
                height: "50px",
                justifyContent: "space-between",
            }}
            >
                <span>{activeroom ? activeroom.name : "Select a room"}</span>
                <div id="callandvideocall"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <div id="video_call"
                        className="callaction"
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "5px",
                            border: "2px solid #10192A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "20px",
                            cursor: "pointer"
                        }}
                    >

                    </div>

                    <div id="call"
                        className="callaction"
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "5px",
                            border: "2px solid #10192A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "20px",
                            cursor: "pointer"
                        }}
                    >

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageArea;