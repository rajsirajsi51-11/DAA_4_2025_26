class Solution {
public:
    vector<int> maxOfSubarrays(vector<int>& arr, int k) {
        int n = arr.size();
        vector<int> result;
        for(int i=0;i<=n-k;i++){
            int mx=arr[i];
            for(int j=i;j<i+k;j++){
                mx=max(mx,arr[j]);
            }
            result.push_back(mx);
        }
        return result;
    }
};