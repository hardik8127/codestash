import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    const userId = req.userId;

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error in creating Playlist", error);
    res.status(500),
      json({
        success: false,
        message: "Error in creating Playlist",
      });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlist = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          problem: true,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error in fetching Playlist", error);
    res.status(500),
      json({
        success: false,
        message: "Error in fetching Playlist",
      });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          problem: true,
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlist Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error in fetching Playlist", error);
    res.status(500),
      json({
        success: false,
        message: "Error in fetching Playlist",
      });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    // create records for each problem
    const problemsinPlaylist = await db.problemsinPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Prblems added in playlist successfully",
      problemsinPlaylist,
    });
  } catch (error) {
    console.error("Error in Adding problems in Playlist", error);
    res.status(500),
      json({
        success: false,
        message: "Error in Adding problems in Playlist",
      });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist Deleted successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Error in deleting Playlist", error);
    res.status(500),
      json({
        success: false,
        message: "Failed to Delete Playlist",
      });
  }
};

export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }
    const deletedProblem = await db.problemsinPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Problem Removed From Playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error in Removing Problem from Playlist", error);
    res.status(500),
      json({
        success: false,
        message: "Failed to Remove Problem Playlist",
      });
  }
};
