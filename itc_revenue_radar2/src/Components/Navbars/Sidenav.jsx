import React from "react";

function Sidenav() {
  return (
    <nav className="navbar navbar-expand-sm ">
      <div
        className="collapse navbar-collapse show"
        id="navbarSupportedContent2"
      >
        <ul className="navbar-nav flex-column mt-4">
       
          <li className="nav-item active  ">
            <a className="nav-link" href="/simulator  ">
             Simulator{" "}
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/optimizer">
            Optimizer{" "}
            </a>
          </li>
          {/* <li className="nav-item active">
            <a className="nav-link" href="/previousprompts">
              Previous Prompts Output{" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/deletefile">
              Delete Files{" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/uploadfile">
              Upload File{" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/fileupload">
              File(upload){" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/tokencalmulti">
              Tokens Calculator(multiple){" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/tokencalbatchwise">
              Tokens Calculator(batch id wise){" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/finalize">
              Finalize{" "}
            </a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/downloadrejectedfiles">
              Download Rejected Files{" "}
            </a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}

export default Sidenav;
