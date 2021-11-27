import React, { useState, useEffect } from 'react';
import './Scheduler.css';
import 'antd/dist/antd.css'; // antd css for buttons , dropdown and notifications
import background from '../images/home.png'
import background2 from '../images/student.png'
import background3 from '../images/detail.png'
import { Popconfirm, notification, Select } from "antd";

//api call fir getting and adding student details
import { apiAddContent, apiGetDetails } from '../api/schedulerApi.js';
const { Option } = Select;
function Scheduler() {
    const [name, setName] = useState("");
    const [classroom, setclassroom] = useState("");
    const [rollno, setRollno] = useState("");
    const [preference, setPreference] = useState("");
    const [role, setRole] = useState("Select Role");
    const [students, setStudentList] = useState([]);
    const [StudentLoading, setStudentLoading] = useState(false);

    useEffect(() => {
        getStudentDetails()
    }, []);
    useEffect(() => {
        selectRole()
    }
    )

    function handleChange(value) {
        setPreference(value);
    }
    function handleClassChange(value) {
        setclassroom(value);
    }
    function handleRoleChange(value) {
        getStudentDetails()
        setRole(value);
    }

    //notification that will be popped on submiting form
    const onSuccess = (e) => {
        setTimeout(() => {
            notification.success({ description: "Your Response have been saved", placement: 'topRight' });
        })
    }

    //notification when you choose not to submit the form
    function cancelSubmit(e) {
        notification.warning({ description: 'Did not save response', placement: 'topRight' })
    }

    //will call the api that will add the student details in the backend
    function AddStudent() {
        //student object that we will be sending to add in the student table
        const student = {
            name: name,
            rollno: rollno,
            sClass: classroom,
            preference: preference,
        };
        apiAddContent(student)
            .then(response => {
                onSuccess();
            })
            .catch(error => {
                if (error) {
                    if (error.status === 500) {
                        notification.error({ descroption: "You have already filled the form", placement: 'topRight' });
                    }
                    notification.error({ descroption: "SERVER ERROR", placement: 'topRight' });
                }
                else {
                    notification.error({ descroption: "SERVER ERROR", placement: 'topRight' });
                }
            })
    }

    //function to fetch the student details who chose offline mode and are from the selected class
    function getStudentDetails() {
        setStudentLoading(true);
        apiGetDetails()
            .then(response => {
                let arr = [];
                let seatno = 0;
                response.map((student) => {
                    //first 50/2 students will be accepted for the offline classes
                    //students will sit on one seat living the other empty as a precaution for covid time
                    //allocating seat in next 2 
                    if (seatno + 2 < 50)
                        if (student.preference === "Offline Mode" && student.sClass === classroom) {

                            let ob = {
                                name: student.name,
                                rollno: student.rollno,
                                sClass: student.sClass,
                                preference: student.preference,
                                seatno: seatno + 2
                            }
                            arr.push(ob)
                            seatno = seatno + 2
                        }

                })
                setStudentList(arr);
                setStudentLoading(false);
            })
            .catch(error => {
                notification.error({ descroption: "server not connected", placement: 'topRight' });
                setStudentLoading(false);
            })
    }

    //fcuntion for the the particular role (student or teacher)
    function selectRole() {
        return (
            <div
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh'
                }}>
                {selectClass()}
                <label className='labelstyle'
                    style={{
                        marginLeft: "500px",
                    }}
                >Select Role</label>

                <Select placeholder="Select Role" style={{ width: 200 }} onChange={handleRoleChange}>
                    <Option value="Student">Student</Option>
                    <Option value="Teacher">Teacher</Option>
                </Select>
            </div>
        )
    }

    //home page were you will be allowed to select whether you are student or teacher and if role id already selected 
    //if you select student then it will lead you to students form page 
    //else it will lead you to teachers page 
    function showRole() {
        if (role === "Select Role" || classroom === " ") {
            return (
                <div>
                    {selectRole()}
                </div>
            );
        }
        else if (role === "Student") {
            return (
                <div
                    style={{
                        backgroundImage: `url(${background2})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        width: '100vw',
                        height: '100vh'
                    }}
                >
                    <div
                        style={{ marginLeft: '40px' }}>
                        <b className='heading'>Weekly Class Scheduler</b>
                        {console.log(students[0])}
                        {selectMode()}
                        {SubmitButton()}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    {particularClass()}
                </div>
            );
        }
    }

    //on clickng home button it will lead you to home page
    function handleHome() {
        getStudentDetails()
        setRole("Select Role");
        selectRole();
    }

    //function that will call the student api and it will give the student details who chose offline mode
    function particularClass() {
        return (
            <div>
                {seeStudentDetails()}
            </div>
        )
    }

    //funtion to show the fetched student details on the ui inside a table
    function seeStudentDetails() {

        return (

            <div
                style={{
                    backgroundImage: `url(${background3})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100vw',
                    height: '100vh'
                }}
            >
                <h1 className="student">Student Details</h1>
                <table className="table">
                    <tr>
                        <th className="tableTh">Roll no</th>
                        <th className="tableTh">Name</th>
                        <th className="tableTh">Class</th>
                        <th className="tableTh">Preference</th>
                        <th className="tableTh">SeatNo</th>
                    </tr>

                    {students.map((student) =>
                        <tr>
                            <td className="tableTd">{student.rollno}</td>
                            <td className="tableTd">{student.name}</td>
                            <td className="tableTd">{student.sClass}</td>
                            <td className="tableTd">{student.preference}</td>
                            <td className="tableTd">{student.seatno}</td>
                        </tr>

                    )}
                </table>
                <div>
                    <button className='submit'
                        style={{ marginLeft: "98px" }}
                        onClick={() => handleHome()}
                    >Home</button>
                </div>
            </div>
        );
    }



    //weekly form where students will fill their preference and inout their name and roll no and click the submit button
    function SubmitButton() {
        return (
            <div className='title'>
                <div>
                    <label className='labelstyle'>Student Name</label>
                    <input
                        className='input-css'
                        placeholder="Enter Student Name"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        required
                    />
                </div>
                <div>
                    <label className='labelstyle'>Student Rollno.</label>
                    <input
                        className='input-css'
                        placeholder="Enter Student Rollno."
                        onChange={(e) => {
                            setRollno(e.target.value)
                        }}
                        required
                    />
                </div>
                <div>
                    <Popconfirm
                        title="Are you Sure you want to submit?"
                        onConfirm={AddStudent}
                        onCancel={cancelSubmit}
                        okText="yes"
                        caccelText="No"
                    >
                        <button className='submit'
                        >Submit</button>
                    </Popconfirm>
                    <button className='submit'
                        onClick={() => handleHome()}
                    >Home</button>
                </div>
            </div>
        );
    }

    //droopdown which will show which mode student want to choose
    function selectMode() {
        return (
            <>
                <div className='scheduler'>
                    <label className='labelstyle'>Select Preference</label>
                    <Select placeholder="Select Preference" style={{ width: 400, marginRight: '20px' }} onChange={handleChange}>
                        <Option value="Online Mode">Online Mode</Option>
                        <Option value="Offline Mode">Offline Mode</Option>
                    </Select>
                </div>
            </>
        )
    }

    //dropdown which will allow student to choose which class they are in 
    function selectClass() {
        return (
            <>
                <div className='scheduler'>
                    <label className='labelstyle' style={{
                        marginLeft: "500px",
                        marginTop: "100px"
                    }}>Select Class</label>
                    <Select placeholder="Select Class" style={{ width: 200, marginRight: '20px', marginTop: "100px" }} onChange={handleClassChange}>
                        <Option value="Class I">Class I</Option>
                        <Option value="Class II">Class II</Option>
                        <Option value="Class III">Class III</Option>
                        <Option value="Class IV">Class IV</Option>
                        <Option value="Class V">Class V</Option>
                        <Option value="Class VI">Class VI</Option>
                        <Option value="Class VII">Class VII</Option>
                        <Option value="Class VIII">Class VIII</Option>
                        <Option value="Class IX">Class IX</Option>
                        <Option value="Class X">Class X</Option>
                        <Option value="Class XI">Class XI</Option>
                        <Option value="Class XII">Class XII</Option>
                    </Select>
                </div>
            </>
        )
    }


    return (
        <div>
            {showRole()}
        </div>
    );
}

export default Scheduler;