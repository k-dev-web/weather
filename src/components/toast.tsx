import {useState, useEffect} from 'react';
import './toast.css';

export const Toast = (props: any) => {
    const {toastList, deleteToast} = props;
    const [list, setList] = useState<any[]>(toastList);

    useEffect(() => {
        setList([...toastList]);
    }, [toastList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, 3000);

        return () => {
            clearInterval(interval);
        }

    }, [toastList, list]);


    return (
        <>
            <div className={`notification-container top-right`}>
                {
                    list.map((toast, i) =>
                        <div
                            key={i}
                            className={`notification toast top-right`}
                            style={{backgroundColor: toast.type}}
                        >
                            <button onClick={() => deleteToast(toast.id)}>
                                X
                            </button>
                            <div className="notification-image">
                                <img src="/bell.svg" alt=""/>
                            </div>
                            <div>
                                <p className="notification-title">{toast.title}</p>
                                <p className="notification-message">
                                    {toast.description}
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
}
