"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants";
import { toast } from 'react-toastify';

type Props = {};

interface DataT {
  json_url: string;
  vmix_url: string;
  replay_start_recording_interval: string;
  replay_set_speed_value: string;
  replay_export_switch: boolean;
  check_interval: string;
  sleep_duration: string;
  sleep_window_input: string;
  homepen1num_input: string;
  homepen2num_input: string;
  awaypen1num_input: string;
  awaypen2num_input: string;
  quickplay_input: string;
  export_folder : string;
}

function MainInterface({}: Props) {
  const [loading, setLoading] = useState(true);
  const [data,setData] = useState<DataT>({
    "json_url": "",
    "vmix_url": "",
    "replay_start_recording_interval": "",
    "replay_set_speed_value": "",
    "replay_export_switch": false,
    "check_interval": "",
    "sleep_duration": "",
    "sleep_window_input": "",
    "homepen1num_input": "",
    "homepen2num_input": "",
    "awaypen1num_input": "",
    "awaypen2num_input": "",
    "quickplay_input": "",
    "export_folder": ""
})

  const [status,setStatus] = useState("Stopped")
  const [logs,setLogs] = useState("");

  useEffect(() => {
    getData();
  }, []);

  // api handlers
  const getData = async () => {
    const resp = await axios.get(API_URL + "settings");
    if (resp.status === 200){
      const d = await resp.data;
      setData(d);
      toast("Fetched data")
      console.log(d)
      setLoading(false);
    }else{
      toast.error("API Error")
    }
  }

  const updateData = async () => {
    const resp = await axios.post(API_URL + "settings/",data);
    if (resp.status === 201){
      toast.success("Updated")
      setLoading(true);
      await getData();
    }else{
      toast.error("API Error")
    }
  }

  const getStatus = async () => {
    const resp = await axios.get(API_URL + "status");
    if (resp.status === 200){
      const d = await resp.data as {status : string};
      setStatus(d.status);
    }else{
      toast.error("API Error")
    }
  }
  const getLogs = async () => {
    const resp = await axios.get(API_URL + "logs");
    if (resp.status === 200){
      const d = await resp.data as {message : string}[];
      let msg = "";
      for (const m of d){
        msg += m.message + "\n"
      }
      setLogs(msg);
    }else{
      toast.error("API Error")
    }
  }

  const startScript = async () => {
    const resp = await axios.get(API_URL + "start")
    if (resp.status === 200){
      toast.success("Script started")
    }else{
      toast.error("Failed starting script")
    }
  }

  const stopScript = async () => {
    const resp = await axios.get(API_URL + "stop")
    if (resp.status === 200){
      toast.success("Script stopped")
    }else{
      toast.error("Failed stopping script")
    }
  }



  // events
  useEffect(() => {
    // Set up a timer
    const timerId = setInterval(() => {
      getStatus();
      getLogs();
    }, 3000); 

    return () => {
      clearInterval(timerId);
    };
  }, []);


  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target;
    const name = t.name as keyof DataT;
    let temp = {...data}
    if (name === "replay_export_switch"){
      temp["replay_export_switch"] = t.checked;
    }else{
      temp[name] = t.value;
    }
    console.log(temp)
    setData(temp)
  }

  return (
    <>
      {!loading && (
        <>
          <section className="my-5">
            <div className="container">
              <div className="text-center">
                <img className="mb-4" src="img/logo.png" />
              </div>
              <div className="row">
                <div className="col-md-7 d-flex align-items-stretch">
                  <div className="card flex-grow-1">
                    <div className="card-header">
                      <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="true"
                            href="#!"
                          >
                            Settings
                          </a>
                        </li>
                        {/* <li className="nav-item">
                          <a className="nav-link" href="#!">
                            Print Report
                          </a>
                        </li> */}
                      </ul>
                    </div>
                    <div className="card-body">
                    <div className="mb-4 d-inline-flex align-items-center justify-content-center w-100">
                      <a href="#" className="ms-2 btn btn-primary" onClick={startScript}>
                        Start
                      </a>
                      <h6 className="mx-2 mb-0">Script Status : <span className="text-primary">{status}</span></h6>
                      <a href="#" className="ms-2 btn btn-primary" onClick={stopScript}>
                        Stop
                      </a>
                      </div>
                      {/* JSON URL */}
                      <div className="mb-4">
                        <label className="form-label">JSON URL</label>
                        <input type="text" className="form-control" name="json_url" value={data.json_url} onChange= {handleChange} />
                      </div>
                      {/* VMIX URL */}
                      <div className="mb-4">
                        <label className="form-label">VMIX URL</label>
                        <input type="text" className="form-control" name="vmix_url" value={data.vmix_url} onChange= {handleChange}  />
                      </div>
                      {/* Check Interval */}
                      <div className="mb-4">
                        <label className="form-label">
                          Check Interval (in Seconds)
                        </label>
                        <input type="number" className="form-control" name="check_interval" value={data.check_interval} onChange= {handleChange} />
                      </div>
                      {/* Replay Set Speed Value */}
                      <div className="mb-4">
                        <label className="form-label">
                          Replay Set Speed Value
                        </label>
                        <input type="number" className="form-control" name="replay_set_speed_value" value={data.replay_set_speed_value} onChange= {handleChange} />
                        <small className="float-end">
                          <strong>1.0</strong>
                        </small>
                      </div>
                      {/* SLEEP_TRIGGER_DURATION */}
                      <div className="mb-4">
                        <label className="form-label">
                          SLEEP_TRIGGER_DURATION (in minute)
                        </label>
                        <input type="number" className="form-control" name="sleep_duration" value={data.sleep_duration} onChange= {handleChange} />
                      </div>
                      {/* SLEEP_WINDOW */}
                      <div className="mb-4">
                        <label className="form-label">SLEEP_WINDOW</label>
                        <input type="number" className="form-control" name="sleep_window_input" value={data.sleep_window_input} onChange= {handleChange} />
                      </div>
                      {/* HOMEPEN1NUM */}
                      <div className="mb-4">
                        <label className="form-label">HOMEPEN1NUM</label>
                        <input type="number" className="form-control" name="homepen1num_input" value={data.homepen1num_input} onChange= {handleChange} />
                      </div>
                      {/* HOMEPEN2NUM */}
                      <div className="mb-4">
                        <label className="form-label">HOMEPEN2NUM</label>
                        <input type="number" className="form-control" name="homepen2num_input" value={data.homepen2num_input} onChange= {handleChange} />
                      </div>
                      {/* AWAYPEN1NUM */}
                      <div className="mb-4">
                        <label className="form-label">AWAYPEN1NUM</label>
                        <input type="number" className="form-control" name="awaypen1num_input" value={data.awaypen1num_input} onChange= {handleChange} />
                      </div>
                      {/* AWAYPEN2NUM */}
                      <div className="mb-4">
                        <label className="form-label">AWAYPEN2NUM</label>
                        <input type="number" className="form-control" name="awaypen2num_input" value={data.awaypen2num_input} onChange= {handleChange} />
                      </div>
                      {/* QuickPlay Input */}
                      <div className="mb-4">
                        <label className="form-label">QUICKPLAY</label>
                        <input type="number" className="form-control" name="quickplay_input" value={data.quickplay_input} onChange= {handleChange} />
                      </div>
                      {/* Replay Export Switch */}
                      <div className="mb-4">
                        <label className="form-label">
                          Replay Export Switch
                        </label>
                        <span className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            name="replay_export_switch" checked={data.replay_export_switch}
                            onChange= {handleChange}
                          />
                        </span>
                      </div>
                      {/* Replay Export Folder */}
                      <div className="mb-4">
                        <label className="form-label">
                          Replay Export Folder
                        </label>
                        {/* <input type="file" className="form-control" /> */}
                        <input type="text" className="form-control" name="export_folder" value={data.export_folder} onChange= {handleChange} />
                      </div>
                      <a href="#" className="btn btn-primary" onClick={updateData}>
                        Save
                      </a>
                      

                      
                    </div>
                  </div>
                </div>
                <div className="col-md-5 d-flex align-items-stretch">
                  <div className="card flex-grow-1">
                    <div className="card-header">
                      <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            aria-current="true"
                            href="#!"
                          >
                            Output
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="card-body">
                      {/* Output */}
                      <div className=" mb-4">
                        <textarea
                          className="form-control"
                          placeholder="No Data"
                          rows={18}
                          cols={18}
                          value={logs}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12 d-flex align-items-stretch">
                  <div className="card flex-lg-grow-1">
                    <div className="card-body">
                      {/* Timestamp */}
                      <label>Timestamp</label>
                      <div className="input-group">
                        <input type="number" className="form-control" />
                        <input type="time" className="form-control" />
                        <div className="input-group-append">
                          <button className="btn btn-primary">Save</button>
                        </div>
                      </div>

                      <table className="table mt-3">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">1</th>
                            <td>6:00 AM</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default MainInterface;
