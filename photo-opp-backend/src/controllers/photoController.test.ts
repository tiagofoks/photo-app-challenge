import request from "supertest";
import app from "../app";
let mockServerTimestamp: jest.Mock;

jest.mock("firebase-admin", () => {
  mockServerTimestamp = jest.fn(() => ({
    /* Retorna um objeto simples para o timestamp */
  }));
  const actualFirebaseAdmin = jest.requireActual("firebase-admin");

  return {
    ...actualFirebaseAdmin,
    firestore: {
      FieldValue: {
        serverTimestamp: mockServerTimestamp,
      },
    },
    __esModule: true,
  };
});

let mockAdd: jest.Mock;
let mockGet: jest.Mock;
let mockOrderBy: jest.Mock;
let mockCollection: jest.Mock;

jest.mock("../config/firebase", () => {
  mockAdd = jest.fn().mockResolvedValue({ id: "mockedDocId" });
  mockGet = jest.fn();
  mockOrderBy = jest.fn(() => ({
    get: mockGet,
  }));
  mockCollection = jest.fn((collectionName) => ({
    add: mockAdd,
    orderBy: mockOrderBy,
  }));

  return {
    db: {
      collection: mockCollection,
    },
    __esModule: true,
  };
});

let mockCloudinaryUpload: jest.Mock;

jest.mock("../config/cloudinary", () => {
  mockCloudinaryUpload = jest
    .fn()
    .mockResolvedValue({
      secure_url: "http://mocked.cloudinary.com/image.jpg",
    });
  return {
    cloudinary: {
      uploader: {
        upload: mockCloudinaryUpload,
      },
    },
    __esModule: true,
  };
});

describe("Photo Controller", () => {
  const dummyImageData =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQoLCwsLDDBEBAQECR4YMi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/QAFEBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVgf//Z";

  beforeEach(() => {
    jest.clearAllMocks();

    mockCloudinaryUpload.mockResolvedValue({
      secure_url: "http://mocked.cloudinary.com/image.jpg",
    });
    mockServerTimestamp.mockClear();

    mockGet.mockResolvedValue({
      docs: [],
      empty: true,
    });
  });

  it("should upload a photo and save its URL to Firestore", async () => {
    const res = await request(app)
      .post("/api/upload")
      .send({ imageData: dummyImageData });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Upload e registro bem-sucedidos!");
    expect(res.body.imageUrl).toEqual("http://mocked.cloudinary.com/image.jpg");

    expect(mockCloudinaryUpload).toHaveBeenCalledTimes(1);
    expect(mockCloudinaryUpload).toHaveBeenCalledWith(
      dummyImageData,
      expect.any(Object)
    );

    expect(mockCollection).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledWith("photos");
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith({
      imageUrl: "http://mocked.cloudinary.com/image.jpg",
      timestamp: expect.any(Object),
    });

    expect(mockServerTimestamp).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if no imageData is provided", async () => {
    const res = await request(app).post("/api/upload").send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Dados da imagem não fornecidos.");

    expect(mockCloudinaryUpload).not.toHaveBeenCalled();
    expect(mockCollection).not.toHaveBeenCalled();
    expect(mockServerTimestamp).not.toHaveBeenCalled();
  });

  it("should return 500 if Cloudinary upload fails", async () => {
    mockCloudinaryUpload.mockRejectedValueOnce(new Error("Cloudinary failed"));

    const res = await request(app)
      .post("/api/upload")
      .send({ imageData: dummyImageData });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual(
      "Erro interno do servidor ao processar a imagem."
    );
    expect(res.body.error).toEqual("Cloudinary failed");

    expect(mockCloudinaryUpload).toHaveBeenCalledTimes(1);
    expect(mockCollection).not.toHaveBeenCalled();
    expect(mockServerTimestamp).not.toHaveBeenCalled();
  });

  describe("GET /api/photos", () => {
    it("should return an empty array if no photos exist", async () => {
      const res = await request(app).get("/api/photos");

      expect(res.statusCode).toEqual(200);
      expect(res.body.photos).toEqual([]);
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockCollection).toHaveBeenCalledWith("photos");
      expect(mockOrderBy).toHaveBeenCalledTimes(1);
      expect(mockOrderBy).toHaveBeenCalledWith("timestamp", "desc");
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it("should return a list of photos if they exist", async () => {
      mockGet.mockResolvedValueOnce({
        docs: [
          {
            id: "photo1",
            data: () => ({
              imageUrl: "http://mocked.cloudinary.com/photo1.jpg",
              timestamp: "2024-01-01T10:00:00Z",
            }),
          },
          {
            id: "photo2",
            data: () => ({
              imageUrl: "http://mocked.cloudinary.com/photo2.jpg",
              timestamp: "2024-01-02T11:00:00Z",
            }),
          },
        ],
      });

      const res = await request(app).get("/api/photos");

      expect(res.statusCode).toEqual(200);
      expect(res.body.photos).toEqual([
        {
          id: "photo1",
          imageUrl: "http://mocked.cloudinary.com/photo1.jpg",
          timestamp: "2024-01-01T10:00:00Z",
        },
        {
          id: "photo2",
          imageUrl: "http://mocked.cloudinary.com/photo2.jpg",
          timestamp: "2024-01-02T11:00:00Z",
        },
      ]);
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockCollection).toHaveBeenCalledWith("photos");
      expect(mockOrderBy).toHaveBeenCalledTimes(1);
      expect(mockOrderBy).toHaveBeenCalledWith("timestamp", "desc");
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if Firestore fails to fetch photos", async () => {
      mockGet.mockRejectedValueOnce(new Error("Firestore fetch failed"));

      const res = await request(app).get("/api/photos");

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual(
        "Erro interno do servidor ao buscar fotos."
      );
      expect(res.body.error).toEqual("Firestore fetch failed");
      expect(mockCollection).toHaveBeenCalledTimes(1);
      expect(mockCollection).toHaveBeenCalledWith("photos");
      expect(mockOrderBy).toHaveBeenCalledTimes(1);
      expect(mockOrderBy).toHaveBeenCalledWith("timestamp", "desc");
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
});
