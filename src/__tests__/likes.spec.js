const request = require("supertest");
const app = require("../app");

describe("Likes", () => {
  it("should be able to give a like to the repository", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"]
      });

    let response = await request(app).post(
      `/repositories/${repository.body.id}/like`
    );

    expect(response.body).toMatchObject({
      likes: 1
    });

    response = await request(app).post(
      `/repositories/${repository.body.id}/like`
    );

    expect(response.body).toMatchObject({
      likes: 2
    });

    let responseEdit = await request(app).put(
      `/repositories/${repository.body.id}/like`
    ).send({
      likes:7
    });

    expect(responseEdit.body).toMatchObject({
      likes: 7
    });
    let responseDelete = await request(app).delete(
      `/repositories/${repository.body.id}/like`
    );

    expect(responseDelete.body).toMatchObject({
      likes: 0
    });
  });

  it("should not be able to like a repository that does not exist", async () => {
    await request(app)
      .post(`/repositories/123/like`)
      .expect(400);
      await request(app)
      .put(`/repositories/123/like`)
      .expect(400);
      await request(app)
      .delete(`/repositories/123/like`)
      .expect(400);
  });
});
