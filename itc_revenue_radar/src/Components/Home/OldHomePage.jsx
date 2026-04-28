import React, { useEffect, useState, useRef } from "react";
import UserService from "../../services/UserService"; import AuthService from "../../services/AuthService";
import getNotification from "../../Redux/Action/action";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar2 from "../Navbars/Navbar2";
import { useSpring, animated, useScroll, useTrail, useTransition, useInView } from '@react-spring/web';

function Home() {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [carouselno, setcarouselno] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionname) => {
    // Replace 'section2' with the id of the section you want to scroll to


    if (sectionname) {
      document
        .getElementById(sectionname)
        .scrollIntoView({ behavior: "smooth" });
    }
    else {
      window.location.href = "/";
    }

  };
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const onScroll = () => {
    if (elementRef.current && isElementInViewport(elementRef.current)) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    onScroll(); // Check if the element is already in the viewport

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const navigate = useNavigate();

  return (
    <div className="mainHomepg">
      <div class="mainbannerbg"></div>
      <div
        className={`rounded bg-white shadow-sm sticky-top ${isScrolled ? "w-100" : "mx-5"
          }`}
        style={{ zIndex: 1030, transition: "all 0.3s ease" }}
      >
        <Navbar2 scrollToSection={scrollToSection} />
      </div>

      <div class="container-fluid bannerbg">
        <a href="#" aria-label="DE" id="home" style={{ float: " left", color: "#ffffff", textDecoration: "none", visibility: " hidden", margin: "-150px 0 0 0" }}>Top </a>
        <div class="container mybannercontainer">
          <div class="row">
            <div class="col-md-6 col-sm-8 col-xs-12">
              <h3>Revenue Radar </h3>
              <h2>Tool built<br /><span>for the modern era</span></h2>
              <p>Measure the true performance of your advertsising spend with Revenue Radar, solutions built for the modern marketer</p>
              <div>
                <ul>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Optimize Budget allocation for highest returns</li>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Predict future marketing with precision</li>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Plan and propose budgets & scenarios that work for you</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid section1">
        <div class="">
          <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-12">
              <img src="./Assets/Images/icon1.webp" class="max icon1" />
            </div>
            <div class="col-md-2 col-sm-3 col-xs-12">
              <div class="sec1box1">
                <iconify-icon icon="proicons:graph"></iconify-icon>
                <div>
                  <span>5X</span><br />
                  Faster Projects
                </div>
              </div>
            </div>
            <div class="col-md-2 col-md-offset-1 col-sm-3 col-xs-12">
              <div class="sec1box1">
                <iconify-icon icon="hugeicons:profit"></iconify-icon>
                <div>
                  <span>+20%</span><br />
                  Profitaility
                </div>
              </div>
            </div>
            <div class="col-md-2 col-md-offset-1 col-sm-3 col-xs-12">
              <div class="sec1box1">
                <iconify-icon icon="carbon:search"></iconify-icon>
                <div>
                  <span>100%</span><br />
                  Transparency
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid section2" >
        <a href="#" aria-label="DE" id="aboutus" style={{ float: "left", color: "#ffffff", textDecoration: " none", visibility: "hidden", margin: "-100px 0 0 0" }}>Top </a>
        <div class="container mycontainer">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
              <img src="./Assets/Images/img1.webp" class="max" />
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">
              <h3>About Us</h3>
              <h2>Data-driven<br /><span>Business Planning Tool</span></h2>
              <div>
                <ul>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Robust & reliable model-building that is fast and easy to scale</li>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Actionable insights for budget planning and optimization</li>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Prove incremental contribution of each channel</li>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Refine budget allocation & optimization</li>
                  <li><iconify-icon icon="charm:circle-tick"></iconify-icon> Maximize the impact of your marketing spend</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid section3">
        <a href="#" aria-label="DE" id="benefits" style={{ float: " left", color: "#ffffff", textDecoration: "none", visibility: " hidden", margin: "-150px 0 0 0" }}>Top </a>
        <div class="container mycontainer">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <h3>Key Benefits</h3>
              <h2>Everything Your Team Needs<br /><span>To Make Your Business Growth Easy</span></h2>
              <p>Whether you are looking to run Marketing Mix Modeling and Planning in-house or want to work with a partner who will manage the process for you, our solution provides flexibility, transparency and focuses on continuous improvement and insight creation.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid subsection3">
        <div class="container mycontainer">
          <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-12">
              <div class="sec3box1">
                <img src="./Assets/Images/b1.webp" class="max" />
                <h3>Enhanced Strategic Planning</h3>
                <p>Market Modeling empowers you to simulate market scenarios, helping refine strategies and anticipate competitor moves.
                </p>
              </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
              <div class="sec3box1">
                <img src="./Assets/Images/b2.webp" class="max" />
                <h3>
                  Maximizing Return Rate</h3>
                <p>
                  Gain a clear view of potential market outcomes, enabling better allocation of resources and maximizing ROI.</p>
              </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
              <div class="sec3box1">
                <img src="./Assets/Images/b3.webp" class="max" />
                <h3>Optimized Resource Allocation</h3>
                <p>Identify high-impact areas to focus investments, maximizing returns with data-backed insights.</p>
              </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-12">
              <div class="sec3box1">
                <img src="./Assets/Images/b4.webp" class="max" />
                <h3>Improved Decision-Making</h3>
                <p>Make proactive, informed decisions with a clearer view of potential market trends, outcomes, and risks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid section4">
        <a href="#" aria-label="DE" id="features" style={{ float: "left", color: "#ffffff", textDecoration: " none", visibility: "hidden", margin: " -100px 0 0 0" }}>Top </a>
        <div class="row">
          <div class="col-md-5 col-sm-6 col-xs-12 section4sub">
            <h3>Features</h3>
            <h2>Top Benefit Of using Revenue Radar<br /><span>Accurate Business Prediction</span></h2>
            <p>With Revenue Radar’s accurate business predictions, gain data-driven insights to forecast trends and make smarter, timely decisions.</p>
          </div>
          <div class="col-md-6 col-md-offset-1 col-sm-6 col-xs-12 padding">
            <div id="carouselExampleIndicators" class="carousel slide mt-3" data-ride="carousel">
              <div class="carousel-inner">
                <div className="carousel-item active ">
                  <div className="d-flex justify-content-between">
                    <div class="  p-3" style={{ width: "350px" }}>
                      <img class="d-block max" src="../Assets/Images/feicon1.webp" alt="Revenue Radar" />
                      <div className="greentheme">Brand Analysis</div>
                      <div className="my-3">
                        Analysis dissects expenditure trends among single brand with multiple tactics in a specific source of expenditure over a defined time frame, providing valuable insights for analytics.

                      </div>
                    </div>
                    <div class=" p-3" style={{ width: "350px" }}>
                      <img class="d-block max" src="../Assets/Images/feicon2.webp" alt="Revenue Radar" />

                      <div className="greentheme">Simulator</div>
                      <div className="my-3">
                        Simulator offers an advanced solution for analyzing expenditure data, transforming raw financial inputs into comprehensive charts,uncovering patterns and trends.

                      </div>
                    </div>
                  </div>

                </div>

                <div className="carousel-item  ">
                  <div className="d-flex justify-items-center">
                    <div class=" p-3" style={{ width: "350px" }}>
                      <img class="d-block max" src="../Assets/Images/feicon3.webp" alt="Revenue Radar" />
                      <div className="greentheme">Optimizer</div>
                      <div className="my-3">
                        Optimizer analyzes expenditure data and user-defined budgets to recommend optimal spending strategies helping in allocation of resources, ensuring maximum return on investment.
                      </div>
                    </div>
                    <div class="p-3" style={{ width: "350px" }}>
                      <img class="d-block max" src="../Assets/Images/feicon4.webp" alt="Revenue Radar" />

                      <div className="greentheme">Compare Optimizer</div>
                      <div className="my-3">
                        Compare Optimizer analyzes expenditure data and user-defined budgets to recommend optimal spending strategies helping in allocation of resources, ensuring maximum return on investment.
                      </div>
                    </div>
                  </div>

                </div>
                <div className="carousel-item  ">
                  <div className="d-flex justify-content-between ">
                    <div class=" p-3" style={{ width: "350px" }}>
                      <img class="d-block max" src="../Assets/Images/feicon5.webp" alt="Revenue Radar" />

                      <div className="greentheme">Event Management</div>
                      <div className="my-3">
                        Event Management allows users to create, edit, and customize campaigns. It also provides real-time monitoring, enabling users to track performance for optimal campaign results.
                      </div>
                    </div>
                    <div class=" p-3" style={{ width: "350px" }}>
                      <img class="d-block max" src="../Assets/Images/feicon1.webp" alt="Revenue Radar" />
                      <div className="greentheme">Saved Reports</div>
                      <div className="my-3">
                        Saved Reports lets User to access securely their saved reports for future reference and continued analysis. </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="carousel-indicatorscustom">
                <span className={carouselno === 0 && "active"} data-target="#carouselExampleIndicators" data-slide-to="0" onClick={() => { setcarouselno(0) }}></span>
                <span className={carouselno === 1 && "active"} data-target="#carouselExampleIndicators" data-slide-to="1" onClick={() => { setcarouselno(1) }}></span>
                <span className={carouselno === 2 && "active"} data-target="#carouselExampleIndicators" data-slide-to="2" onClick={() => { setcarouselno(2) }}></span>
              </div>

            </div>

          </div>
        </div>
      </div>
      <div class="container-fluid section5">
        <a href="#" id="connectwithme" style={{ float: " left", color: " #ffffff", textDecoration: "none", visibility: "hidden", margin: "-100px 0 0 0" }}>Top </a>
        <div class="container mycontainer">
          <div class="row">
            <div class="col-md-6 col-sm-12 col-xs-12">
              <h2>We’d love to hear <span>from you anytime</span></h2>
              {/* <div class="col-md-12 col-sm-12 col-xs-12 padding space1"> */}
              <div className="d-flex justify-content-between">
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <div class="form-group1">
                    <input type="email" class="form-control" id="email" placeholder="Enter Your Full Name" />
                  </div>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <div class="form-group1">
                    <input type="email" class="form-control" id="email" placeholder="Enter Your Email Id" />
                  </div>
                </div>
              </div>
              {/* <div class="col-md-12 col-sm-12 col-xs-12 padding space1"> */}
              <div className="d-flex justify-content-between">
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <div class="form-group1">
                    <input type="email" class="form-control" id="email" placeholder="Enter Your Current Organisation " />
                  </div>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                  <div class="form-group1">
                    <input type="email" class="form-control" id="email" placeholder="Enter Your Mobile No." />
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="form-group">
                  <div class="checkbox">
                    <label><input type="checkbox" /> I agree to the Terms of Service and Privacy Policy.</label>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="connectbtn"><a href="#">Submit Request For Demo <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid footerbg">
        <div class="container mycontainer">
          <div class="row">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <img src="./Assets/Images/ftrlogo.webp" class="max ftrlogo" alt="Revenue Radar" />
              <p>Tool capable of providing realtime Data Modelling and helps users to draw actionable insights for their business.</p>
              <div class="ftrsocialmedia">
                <ul>
                  <li><a href="#" aria-label="DE" target="_blank"><iconify-icon icon="ic:baseline-facebook"></iconify-icon></a></li>
                  <li><a href="#" aria-label="DE" target="_blank"><iconify-icon icon="teenyicons:instagram-solid"></iconify-icon></a></li>
                  <li><a href="#" aria-label="DE" target="_blank"><iconify-icon icon="mdi:linkedin"></iconify-icon></a></li>
                </ul>
              </div>
            </div>
            <div class="col-md-2 col-sm-6 col-xs-12">
              <h5>Company</h5>
              <div>
                <ul>
                  <li><a href="#aboutus" class="scroll" aria-label="DE">About Us</a></li>
                  <li><a href="#keybenefits" class="scroll" aria-label="DE">Key Benefits</a></li>
                  <li><a href="#features" class="scroll" aria-label="DE">Features</a></li>
                  <li><a href="#contactus" class="scroll" aria-label="DE">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <h5>Contact Us</h5>
              <div>
                <ul>
                  <li class="linehe"><iconify-icon icon="mdi:address-marker-outline"></iconify-icon> Quation Solutions Private Limited
                    6th Floor, Tower 3, WARP SJR I Park, EPIP Zone
                    Opp. Sri Sathya Sai Hospital Whitefield Bangalore</li>
                  <li><a href="mailto:Contactus@quation.in" target="_blank" aria-label="DE"><iconify-icon icon="tabler:mail"></iconify-icon> Contactus@quation.in</a></li>
                  <li><a href="tel:+91-80-49568423" target="_blank" aria-label="DE"><iconify-icon icon="fluent:call-16-regular"></iconify-icon> +91-80-49568423</a></li>
                </ul>
              </div>
            </div>
            {/* <div class="col-md-3 col-sm-6 col-xs-12">
              <h5>Get In Touch</h5>
              <div class="space1">
                <div class="form-group">
                  <input type="email" class="form-control" id="email" placeholder="Enter Your Email Adress" />
                </div>
                <div class="ftrconnectbtn"><a href="#" aria-label="DE">Connect With Me <iconify-icon icon="iconamoon:arrow-right-2-bold"></iconify-icon></a></div>
              </div>
            </div> */}
          </div>
        </div>
      </div>


      <div class="container-fluid copybg">
        <div class="container mycontainer">
          <div class="row">
            <div class="col-md-11 col-sm-11 col-xs-12">
              <img src="../Assets/Images/copyimg.webp" class="max" alt="Revenue Radar" /><br />©2023 Quation Solutions Pvt. Ltd., All rights reserved
            </div>
            <div class="col-md-1 col-sm-1 col-xs-12">
              <p id="bottom">
                <a onClick={scrollToTop} aria-label="DE">
                  <iconify-icon icon="tabler:arrow-top-circle" class="scrollerbottom animate__animated animate__infinite animate__slideInUp"></iconify-icon>
                </a>

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
