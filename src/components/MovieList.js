import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "../style.css";
import back from "../Assets/Images/Back.png";
import search from "../Assets/Images/search.png";
import FirstPageData from "../Assets/Json/CONTENTLISTINGPAGE-PAGE1.json";
import { Image } from "react-bootstrap";

class MovieList extends React.Component {
  constructor(props) {
    super();
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      posts: [],
      hasMore: true,
      searchValue: "",
      secondPageData: {},
      ThirdPageData: {},
    };
  }
  componentDidMount() {
    // do some paginated fetch
    this.init();
  }

  filterByInput(e) {
    this.setState({ searchValue: e.target.value });
    var input, filter, table, tr, td, i, txtValue, wholeDiv;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("p");
    for (i = 0; i < tr.length; i++) {
      td = table.getElementsByTagName("p")[i];
      wholeDiv = table.getElementsByClassName("wholeDiv")[i];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          wholeDiv.style.display = "";
        } else {
          wholeDiv.style.display = "none";
        }
      }
    }
  }

  init = () => {
    var posts = [];
    for (var i = 0; i < 10; i++) {
      var new_post = {
        title: FirstPageData.page["content-items"].content[i].name,
        image_url: require("../Assets/Images/" +
          FirstPageData.page["content-items"].content[i]["poster-image"]),
        vote_count: 0,
      };
      posts.push(new_post);
    }
    this.setState({ posts: posts });
  };

  loadMoreDataFirstPage() {
    let new_post = {
      title:
        FirstPageData.page["content-items"].content[this.state.posts.length]
          .name,
      image_url: require("../Assets/Images/" +
        FirstPageData.page["content-items"].content[this.state.posts.length][
          "poster-image"
        ]),
      vote_count: 0,
    };

    const posts = this.state.posts.slice();
    posts.push(new_post);
    this.setState({ posts: posts });
  }

  loadMoreDataSecondPage() {
    let new_post = {
      title: this.state.secondPageData.page["content-items"].content[
        this.state.posts.length -
          FirstPageData.page["content-items"].content.length
      ].name,
      image_url: require("../Assets/Images/" +
        this.state.secondPageData.page["content-items"].content[
          this.state.posts.length - 20
        ]["poster-image"]),
      vote_count: 0,
    };

    const posts = this.state.posts.slice();
    posts.push(new_post);
    this.setState({ posts: posts });
  }

  loadMoreDataThirdPage() {
    let new_post = {
      title: this.state.ThirdPageData.page["content-items"].content[
        this.state.posts.length -
          (FirstPageData.page["content-items"].content.length +
            this.state.secondPageData.page["content-items"].content.length)
      ].name,
      image_url: require("../Assets/Images/" +
        this.state.ThirdPageData.page["content-items"].content[
          this.state.posts.length -
            (FirstPageData.page["content-items"].content.length +
              this.state.secondPageData.page["content-items"].content.length)
        ]["poster-image"]),
      vote_count: 0,
    };

    const posts = this.state.posts.slice();
    posts.push(new_post);
    this.setState({ posts: posts });
  }

  loadMore() {
    if (
      this.state.posts.length >=
      FirstPageData.page["content-items"].content.length
    ) {
      let second = [];
      import("../Assets/Json/CONTENTLISTINGPAGE-PAGE2.json").then((data) => {
        second = data.default;
        this.setState({ secondPageData: second }, () => {
          if (
            this.state.posts.length >=
            FirstPageData.page["content-items"].content.length +
              this.state.secondPageData.page["content-items"].content.length
          ) {
            let third = [];
            import("../Assets/Json/CONTENTLISTINGPAGE-PAGE3.json").then(
              (data) => {
                third = data.default;
                this.setState({ ThirdPageData: third }, () => {
                  if (
                    this.state.posts.length >=
                    FirstPageData.page["content-items"].content.length +
                      this.state.secondPageData.page["content-items"].content
                        .length +
                      this.state.ThirdPageData.page["content-items"].content
                        .length
                  ) {
                    this.setState({ hasMore: false });
                    return;
                  } else {
                    this.loadMoreDataThirdPage();
                  }
                });
              }
            );
          } else {
            this.loadMoreDataSecondPage();
          }
        });
      });
    } else {
      this.loadMoreDataFirstPage();
    }
  }

  render() {
    return (
      <div className="main">
        <InfiniteScroll
          dataLength={this.state.posts.length}
          pageStart={0}
          width={100}
          next={this.loadMore}
          hasMore={this.state.hasMore}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! No more data to load !!</b>
            </p>
          }
        >
          <>
            {this.state.posts.length === 0 ? (
              <h5>No records found</h5>
            ) : (
              <div>
                <div className="row header">
                  <div
                    className="column2">
                    <h6>
                      <Image className="titleImg" src={back} />{" "}
                      {FirstPageData.page.title}
                    </h6>
                  </div>
                  <div
                    className="column2"
                  >
                    <Image style={{marginTop:"6px"}} className="titleImg searchImg" src={search} />
                    <input
                      type="text"
                      id="myInput"
                      className="searchImg"
                      value={this.state.searchValue}
                      onChange={(e) => {
                        this.filterByInput(e);
                      }}
                    />
                  </div>
                </div>
                <div className="row" style={{ padding: "2%" }} id="myTable">
                  {this.state.posts.length > 0
                    ? this.state.posts.map((item, index) => (
                        <div
                          key={index}
                          className="wholeDiv column"
                          style={{ paddingLeft: "1%", paddingRight: "1%" }}
                        >
                          <div>
                            <Image
                              className="card-img-top"
                              src={item.image_url}
                              alt="Image Missing"
                              style={{ height: "35vh" }}
                            />
                            <p className="title">{item.title}</p>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            )}
          </>
        </InfiniteScroll>
      </div>
    );
  }
}

export default MovieList;
