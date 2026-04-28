#include <iostream>
using namespace std;

class Node{
public:
    int data;
    Node* next;
    Node(int val){
        data=val;
        next=NULL;
    }
};
class Stack{
    Node* top;
public:
    Stack(){
        top=NULL;
    }
    void push(int val){
        Node* newNode=new Node(val);
        newNode->next=top;
        top=newNode;
        cout<<val<<" pushed\n";
    }
    int pop(){
        if(isEmpty()){
            cout<<"Stack Underflow\n";
            return -1;
        }
        int popped=top->data;
        Node* temp=top;
        top=top->next;
        delete temp;
        return popped;
    }
    int peek(){
        if(isEmpty()){
            cout<<"Stack is empty\n";
            return -1;
        }
        return top->data;
    }
    bool isEmpty(){
        return top==NULL;
    }
    int size(){
        int count=0;
        Node* temp=top;
        while(temp!=NULL){
            count++;
            temp=temp->next;
        }
        return count;
    }
    void display(){
        Node* temp=top;
        while(temp!=NULL){
            cout<<temp->data<<" -> ";
            temp=temp->next;
        }
        cout<<"NULL\n";
    }
};

