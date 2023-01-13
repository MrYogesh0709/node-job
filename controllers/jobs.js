const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/Job");
const getAllJobs = async (req, res) => {
  //we won't get all jobs we get only job who created by this createdBy which is authenticated route so we can get req.user.userId;
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ createdBy: req.user.userId, _id: jobId });
  if (!job) {
    throw new NotFoundError(`No Job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  //who create this so we go for createBy and fo for auth userId
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;
  if (company === "" || position === "") {
    throw new BadRequestError("Please provide company and position");
  }
  const job = await Job.findByIdAndUpdate(
    { createdBy: req.user.userId, _id: jobId },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findByIdAndRemove({
    createdBy: req.user.userId,
    _id: jobId,
  });
  if (!job) {
    throw new NotFoundError(`No Job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
