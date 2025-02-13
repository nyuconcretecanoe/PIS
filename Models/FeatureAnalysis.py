# %%
import pandas as pd
import numpy as np
import sys
import os


from sklearn.feature_selection import mutual_info_classif
from sklearn.feature_selection import VarianceThreshold
from sklearn.preprocessing import StandardScaler

# %%
from Preprocessing import *

# %%
X = np.array(catchcompletearr)
y = np.array(catchresultarr)

X2 = np.array(pullcompletearr)
y2 = np.array(pullresultarr)

X3 = np.array(recoverycompletearr)
y3 = np.array(recoveryresultarr)

# %%
# X

# %%
feature_varX = X.var(axis=0)
mean_varX = feature_varX.mean()
percentile25X = np.percentile(feature_varX, 25)

print(f"Mean Variance: {mean_varX}")
print(f"Bottom 25th Percentile Variance: {percentile25X}")

# %%
feature_varX2 = X2.var(axis=0)
mean_varX2 = feature_varX2.mean()
percentile25X2 = np.percentile(feature_varX2, 25)

print(f"Mean Variance: {mean_varX2}")
print(f"Bottom 25th Percentile Variance: {percentile25X2}")

# %%
feature_varX3 = X3.var(axis=0)
mean_varX3 = feature_varX3.mean()
percentile25X3 = np.percentile(feature_varX3, 25)

print(f"Mean Variance: {mean_varX3}")
print(f"Bottom 25th Percentile Variance: {percentile25X3}")

# %% [markdown]
# # Feature Variance Analysis

# %% [markdown]
# ### We can adjust the threshold but for now I have 0.01. Above there is more data about it

# %%
# Function that reduces features with variance under 1 percent
def remove_low_variance(X):
    selector = VarianceThreshold(threshold=0.01)
    selector.fit(X)
    return X[:, selector.get_support()]

# %%
X_reduced = remove_low_variance(X)

# X_reduced

# %%
X2_reduced = remove_low_variance(X2)

# X2_reduced

# %%
X3_reduced = remove_low_variance(X3)

# X3_reduced

# %% [markdown]
# # High Correlation Features

# %%
def remove_high_correlation(df, threshold=0.95):

    corr_matrix = df.corr().abs()
    
    # mask to avoid duplicate comparisons and to make sure one of each correlation pair remains
    upper_triangle = np.triu(np.ones(corr_matrix.shape), k=1)
    
    high_corr_pairs = (corr_matrix > threshold) & (upper_triangle == 1)

    high_corr_features = [column for column in corr_matrix.columns if any(high_corr_pairs[column])]

    df_filtered = df.drop(columns=high_corr_features)

    return df_filtered, high_corr_features

# %%
threshold = 0.95 # can be adjusted easily

X_fully_reduced, removedX = remove_high_correlation(pd.DataFrame(X_reduced), threshold=threshold)
X2_fully_reduced, removedX2 = remove_high_correlation(pd.DataFrame(X2_reduced), threshold=threshold)
X3_fully_reduced, removedX3 = remove_high_correlation(pd.DataFrame(X3_reduced), threshold=threshold)

# %%
print(f"Removed Features: {removedX}")
print("Original shape:", X_reduced.shape)
print("New shape after removing:", X_fully_reduced.shape)

# %%
print(f"Removed Features: {removedX2}")
print("Original shape:", X2_reduced.shape)
print("New shape after removing correlated features:", X2_fully_reduced.shape)

# %%
print(f"Removed Features: {removedX3}")
print("Original shape:", X3_reduced.shape)
print("New shape after removing correlated features:", X3_fully_reduced.shape)

# %%

corr_matrixX = X_fully_reduced.corr().abs()

# mask to avoid duplicates
upper_triangleX = np.triu(np.ones(corr_matrixX.shape), k=1)



