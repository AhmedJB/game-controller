"use client"
import React, { useEffect, useState } from 'react'

type Props = {}

function MainInterface({}: Props) {

    const [loading,setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(false);
    },[])



  return <>{ !loading && <>
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
                  <a className="nav-link active" aria-current="true" href="#!">Settings</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#!">Print Report</a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* JSON URL */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input type="text" className="form-control" />
                <label className="form-label">JSON URL</label>
              </div>
              {/* VMIX URL */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input type="text" className="form-control" />
                <label className="form-label">VMIX URL</label>
              </div>
              {/* Check Interval */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input type="number" className="form-control" />
                <label className="form-label">Check Interval (in Seconds)</label>
              </div>
              {/* Replay Set Speed Value */}
              <div data-mdb-input-init className="form-outline mb-4 text-center">
                <input type="number" className="form-control" />
                <label className="form-label">Replay Set Speed Value</label>
                <small><strong>1.0</strong></small>
              </div>
              {/* Replay Export Folder */}
              <div className="mb-4">
                <label className="form-label">Replay Export Folder</label>
                <input type="file"  className="form-control" />
              </div>
              <a href="#" className="btn btn-primary" data-mdb-ripple-init>Save</a>
              <a href="#" className="btn btn-primary" data-mdb-ripple-init>Exit</a>
            </div>
          </div>
        </div>
        <div className="col-md-5 d-flex align-items-stretch">
          <div className="card flex-grow-1">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="true" href="#!">Output</a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* Output */}
              <div data-mdb-input-init className="form-outline mb-4">
                <textarea className="form-control" placeholder="No Data" rows={15} cols={15} defaultValue={""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    </>
  }</>

}

export default MainInterface