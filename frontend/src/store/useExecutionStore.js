import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



export const useExecutionStore = create((set)=>({
    isExecuting:false,
    submission:null,

       executeCode:async ( source_code, language_id, stdin, expected_outputs, problemId)=>{
        try {
            set({isExecuting:true});
            console.log("Submission:",JSON.stringify({
                source_code,
                language_id,
                stdin,
                expected_outputs,
                problemId
            }));
            const res = await axiosInstance.post("/execute-code" , { source_code, language_id, stdin, expected_outputs, problemId });

            set({submission:res.data.result});
      
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error executing code",error);
            toast.error("Error executing code");
        }
        finally{
            set({isExecuting:false});
        }
    }
}))

export const useSubmitStore = create((set, get)=>({
    isExecuting:false,
    submission:null,

       executeCode:async ( source_code, language_id, stdin, expected_outputs, problemId)=>{
        try {
            set({isExecuting:true});
            const res = await axiosInstance.post("/execute-code/submit" , { source_code, language_id, stdin, expected_outputs, problemId });

            const submissionResult = res.data.result || res.data.submission || res.data;
            
            set({submission: submissionResult});
      
            toast.success("Code submitted successfully!");
            return res.data; // Return the response for chaining
        } catch (error) {
            console.log("Error submitting code",error);
            toast.error("Error submitting code");
            throw error; // Re-throw to allow error handling in component
        }
        finally{
            set({isExecuting:false});
        }
    }
}))